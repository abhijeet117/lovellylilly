const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");
const QueryLog = require("../models/QueryLog.model");
const aiService = require("./ai.service");
const searchService = require("./search.service");

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
                        // Booster prompt built in gemini service, but we use mode context here if needed
                        result = await require("./ai.service").generateImage(content, aspectRatio, style);
                        // In socket context, we might want to emit a specific event or use stream_done
                        socket.emit("stream_done", { 
                            chatId, 
                            mode: "image", 
                            imageUrl: result.imageData,
                            revisedPrompt: result.revisedPrompt 
                        });
                    } else if (mode === "generate-video") {
                        const aspectRatio = data.aspectRatio || "16:9";
                        result = await require("./ai.service").generateVideo(content, aspectRatio);
                        socket.emit("stream_done", { 
                            chatId, 
                            mode: "video", 
                            operationId: result.operationId,
                            status: "pending"
                        });
                    } else if (mode === "build-website") {
                        const type = data.type || "landing-page";
                        result = await require("./ai.service").generateWebsite(content, type);
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
                let chat;
                if (currentChatId) {
                    chat = await Chat.findById(currentChatId);
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

                // 4. Stream AI response
                socket.emit("message_status", { status: "generating" });
                let fullResponse = "";
                
                const stream = aiService.streamResponse({
                    query: content,
                    history,
                    sources
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
