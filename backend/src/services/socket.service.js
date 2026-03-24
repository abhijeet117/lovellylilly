const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const QueryLog = require("../models/QueryLog.model");
const aiService = require("./ai.service");
const geminiService = require("./gemini.service");
const searchService = require("./search.service");

// ── Skill Router & Agents (Prompt 5) ────────────────────────────────────────
const { detectSlashCommand, autoDetectSkills, buildSystemPrompt: buildSkillSystemPrompt, getHelpMessage, SKILL_REGISTRY } = require("../skills/router");
const { runBrowserAgent } = require("../agents/browser.agent");
const { runSeoAgent } = require("../agents/seo.agent");
const { runCodeAgent } = require("../agents/coderunner.agent");
// ────────────────────────────────────────────────────────────────────────────

let io;

exports.init = (socketIoInstance) => {
    io = socketIoInstance;

    // Authentication middleware for Socket.io
    io.use(async (socket, next) => {
        try {
            const cookieString = socket.handshake.headers.cookie;
            if (!cookieString) return next(new Error("Authentication error: No cookies found"));

            const token = cookieString.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
            if (!token) return next(new Error("Authentication error: Token not found"));

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) return next(new Error("Authentication error: User not found"));

            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication error: " + err.message));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.user.name} (${socket.id})`);

        // Emit prompt version and model info
        socket.emit("system_prompt_version", { 
            version: "v1.0", 
            model: process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash" 
        });

        socket.on("send_message", async (data) => {
            const { content, chatId, useWebSearch } = data;
            const startTime = Date.now();

            try {
                if (!content || !String(content).trim()) {
                    throw new Error("Message content is required");
                }

                // /help shortcut (moved to bypass AI completely)
                if (content.trim() === '/help') {
                    socket.emit('stream_chunk', { content: getHelpMessage() });
                    socket.emit('stream_done', { chatId: data.chatId || "new", messageId: null, sources: [], followUpSuggestions: [] });
                    return;
                }

                // 1. Detect query mode
                socket.emit("message_status", { status: "detecting_mode" });
                const mode = await aiService.detectMode(content);
                socket.emit("query_mode", { mode });

                // 2. Web search if needed
                let sources = [];
                if (mode === "search" || useWebSearch) {
                    socket.emit("message_status", { status: "searching_web" });
                    sources = await searchService.search(content);
                    socket.emit("sources", { sources });
                }

                // 3. Handle Generation Modes (Phase 2)
                const generationModes = ["generate-image", "generate-video", "build-website"];
                if (generationModes.includes(mode)) {
                    let result;
                    if (mode === "generate-image") {
                        const style = data.style || "realistic";
                        const aspectRatio = data.aspectRatio || "1:1";
                        result = await geminiService.generateImage(content, aspectRatio, style);
                        socket.emit("stream_done", {
                            chatId,
                            mode: "image",
                            imageUrl: result.imageData,
                            revisedPrompt: result.revisedPrompt
                        });
                    } else if (mode === "generate-video") {
                        const aspectRatio = data.aspectRatio || "16:9";
                        result = await geminiService.generateVideo(content, aspectRatio);
                        socket.emit("stream_done", {
                            chatId,
                            mode: "video",
                            operationId: result.operationId,
                            status: "pending"
                        });
                    } else if (mode === "build-website") {
                        const type = data.type || "landing-page";
                        result = await geminiService.generateWebsite(content, type);
                        socket.emit("stream_done", {
                            chatId,
                            mode: "website",
                            fullHtml: result.fullHtml,
                            title: result.title
                        });
                    }
                    return; // Stop processing further for generation modes
                }

                // 4. Get history (Original logic continued)
                let currentChatId = chatId && chatId !== "new" ? chatId : null;
                let chat;
                if (currentChatId) {
                    chat = await Chat.findOne({ _id: currentChatId, user: socket.user._id });
                    if (!chat) {
                        throw new Error("Chat not found");
                    }
                }

                // Create new chat if it doesn't exist
                if (!chat) {
                    const title = await aiService.generateAutoTitle(content);
                    chat = await Chat.create({
                        user: socket.user._id,
                        title,
                        model: process.env.DEFAULT_AI_MODEL || "gpt-4o",
                        queryMode: mode
                    });
                    currentChatId = chat._id;
                }

                const historyMetadata = await Message.find({ chat: currentChatId })
                    .sort({ createdAt: -1 })
                    .limit(10);
                const history = historyMetadata.reverse();

                // ── Skill Router Block (Prompt 5) ──────────────────────────────────────
                let skillSystemPrompt = null;
                let activeSkills = [];
                let specialResult = null;
                let cleanMessage = content;

                // Slash command detection
                const slash = detectSlashCommand(content);
                if (slash && !slash.isHelp) {
                    activeSkills = [{ key: slash.command, skill: slash.skill, score: 10 }];
                    cleanMessage = slash.cleanMessage || content;

                    if (slash.command === 'browse' || /https?:\/\//.test(cleanMessage)) {
                        socket.emit('agent_status', { message: '🌐 Browsing the web...', active: true });
                        specialResult = await runBrowserAgent(cleanMessage);
                        socket.emit('agent_status', { active: false });
                    }

                    if (slash.command === 'seo') {
                        const urlMatch = cleanMessage.match(/https?:\/\/[^\s]+/)?.[0];
                        if (urlMatch) {
                            socket.emit('agent_status', { message: '📈 Analyzing SEO...', active: true });
                            specialResult = await runSeoAgent(urlMatch, socket.user._id);
                            socket.emit('agent_status', { active: false });
                        }
                    }

                    if (slash.command === 'run') {
                        socket.emit('agent_status', { message: '▶️ Running code...', active: true });
                        specialResult = await runCodeAgent(cleanMessage);
                        socket.emit('agent_status', { active: false });
                    }
                } else {
                    // Auto-detect skills from message content
                    activeSkills = autoDetectSkills(content);

                    // Auto-browse any URLs found in the message
                    if (/https?:\/\//.test(content)) {
                        socket.emit('agent_status', { message: '🌐 Browsing...', active: true });
                        specialResult = await runBrowserAgent(content);
                        socket.emit('agent_status', { active: false });
                        if (!activeSkills.find(s => s.key === 'browse') && SKILL_REGISTRY['browse']) {
                            activeSkills.unshift({ key: 'browse', skill: SKILL_REGISTRY['browse'], score: 5 });
                        }
                    }
                }

                // Build dynamic system prompt from active skills
                skillSystemPrompt = buildSkillSystemPrompt(activeSkills);
                if (specialResult?.context) {
                    skillSystemPrompt += `\n\n## Live Data Retrieved:\n${specialResult.context}`;
                }

                // Tell frontend which skills are active
                if (activeSkills.length > 0) {
                    socket.emit('skills_activated', {
                        skills: activeSkills.map(s => ({ name: s.skill.name, icon: s.skill.icon }))
                    });
                }
                // ── End Skill Router Block ─────────────────────────────────────────────

                // 4. Stream AI response
                socket.emit("message_status", { status: "generating" });
                let fullResponse = "";
                
                const stream = aiService.streamResponse({
                    query: cleanMessage,
                    history,
                    sources,
                    skillSystemPrompt
                });

                for await (const chunk of stream) {
                    fullResponse += chunk;
                    socket.emit("stream_chunk", { content: chunk });
                }

                // 5. Generate follow-ups
                const followUpSuggestions = await aiService.generateFollowUps(content, fullResponse);

                // 6. Save message and update chat
                const responseTimeMs = Date.now() - startTime;
                
                // Save user message
                await Message.create({
                    chat: currentChatId,
                    user: socket.user._id,
                    role: "user",
                    content,
                    queryMode: mode,
                    hasWebSearch: sources.length > 0
                });

                // Save assistant message
                const assistantMessage = await Message.create({
                    chat: currentChatId,
                    user: socket.user._id, // Still linked to the user for indexing
                    role: "assistant",
                    content: fullResponse,
                    sources,
                    hasWebSearch: sources.length > 0,
                    queryMode: mode,
                    followUpSuggestions,
                    responseTimeMs,
                    model: chat.model
                });

                // Update chat metadata
                chat.lastMessageAt = Date.now();
                chat.messageCount += 2;
                chat.queryMode = mode;
                await chat.save();

                // Update user total queries
                await User.findByIdAndUpdate(socket.user._id, {
                    $inc: { totalQueries: 1 },
                    lastActiveAt: Date.now()
                });

                // 7. Log query (async)
                QueryLog.create({
                    user: socket.user._id,
                    chat: currentChatId,
                    query: content,
                    model: chat.model,
                    responseTimeMs,
                    usedWebSearch: sources.length > 0,
                    queryMode: mode,
                    status: "success"
                }).catch(err => console.error("Logging failed:", err));

                // 8. Final event
                socket.emit("stream_done", {
                    chatId: currentChatId,
                    messageId: assistantMessage._id,
                    sources,
                    followUpSuggestions
                });

            } catch (error) {
                console.error("Socket Error:", error);
                socket.emit("error", { message: error.message || "Something went wrong" });
                
                // Log failure
                QueryLog.create({
                    user: socket.user._id,
                    query: content,
                    status: "error",
                    errorMessage: error.message
                }).catch(err => console.error("Logging failed:", err));
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};
