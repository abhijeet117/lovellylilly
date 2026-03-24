const { ChatOpenAI } = require("@langchain/openai");
const { ChatAnthropic } = require("@langchain/anthropic");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage, SystemMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { buildSystemPrompt } = require("../utils/buildSystemPrompt");

// Initialize model based on provider
const getModel = (isStreaming = false) => {
    const provider = process.env.DEFAULT_AI_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "openai");
    const modelName = process.env.DEFAULT_AI_MODEL || "gemini-2.0-flash";

    if (provider === "anthropic") {
        return new ChatAnthropic({
            modelName: modelName,
            anthropicApiKey: process.env.ANTHROPIC_API_KEY,
            streaming: isStreaming
        });
    }

    if (provider === "gemini") {
        return new ChatGoogleGenerativeAI({
            model: modelName,
            apiKey: process.env.GEMINI_API_KEY,
            streaming: isStreaming
        });
    }

    if (provider === "minimax") {
        return new ChatOpenAI({
            modelName: modelName || "MiniMax-M2.1",
            openAIApiKey: process.env.MINIMAX_API_KEY,
            configuration: {
                baseURL: "https://minimax-m2.com/api/v1",
            },
            streaming: isStreaming
        });
    }

    return new ChatOpenAI({
        modelName: modelName,
        openAIApiKey: process.env.OPENAI_API_KEY,
        streaming: isStreaming
    });
};

const getFastModel = () => {
    const provider = process.env.DEFAULT_AI_PROVIDER || (process.env.GEMINI_API_KEY ? "gemini" : "openai");
    
    if (provider === "gemini") {
        return new ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            apiKey: process.env.GEMINI_API_KEY
        });
    }
    
    if (provider === "minimax") {
        return new ChatOpenAI({
            modelName: "MiniMax-M2.1",
            openAIApiKey: process.env.MINIMAX_API_KEY,
            configuration: {
                baseURL: "https://minimax-m2.com/api/v1",
            }
        });
    }

    return new ChatOpenAI({
        modelName: "gpt-4o-mini",
        openAIApiKey: process.env.OPENAI_API_KEY
    });
};

exports.streamResponse = async function* ({ query, history = [], sources = [], skillSystemPrompt = null }) {
    const model = getModel(true);
    
    const systemPromptBase = buildSystemPrompt({ 
        queryMode: "search", // assuming search context if sources exist
        isVoiceMessage: false // will be passed from socket later if we update signature
    });

    // If skill router provided a dynamic prompt, use it; otherwise fall back to existing logic
    const systemInstruction = skillSystemPrompt
        ? (sources.length > 0
            ? `${skillSystemPrompt}\n\nWeb Search Results:\n${sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.snippet}`).join("\n\n")}`
            : skillSystemPrompt)
        : (sources.length > 0 
            ? `${systemPromptBase}\n\nWeb Search Results:\n${sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.snippet}`).join("\n\n")}`
            : buildSystemPrompt({ queryMode: "think", isVoiceMessage: false }));

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemInstruction],
        new MessagesPlaceholder("history"),
        ["human", "{query}"]
    ]);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const stream = await chain.stream({
        query: query,
        history: history.map(m => m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content))
    });

    for await (const chunk of stream) {
        yield chunk;
    }
};

exports.detectMode = async (query) => {
    try {
        const model = getFastModel();
        const response = await model.invoke([
            new SystemMessage("Classify this query as exactly one phrasing from this list: search, think, create, generate-image, generate-video, build-website. Return only the classification word."),
            new HumanMessage(`Query: ${query}`)
        ]);

        const mode = response.content.toLowerCase().trim();
        const validModes = ["search", "think", "create", "generate-image", "generate-video", "build-website"];
        return validModes.includes(mode) ? mode : "think";
    } catch (err) {
        console.error("Mode detection failed, defaulting to think:", err.message);
        return "think";
    }
};

exports.generateAutoTitle = async (firstMessage) => {
    try {
        const model = getFastModel();
        const response = await model.invoke([
            new SystemMessage("Generate a short 4–6 word title for a conversation that starts with the provided message. Return only the title, no quotes, no punctuation at the end."),
            new HumanMessage(firstMessage)
        ]);
        return response.content.trim();
    } catch (err) {
        console.error("Auto-title generation failed:", err.message);
        return firstMessage.substring(0, 40).trim() || "New Conversation";
    }
};

exports.generateFollowUps = async (query, response) => {
    const model = getFastModel();
    const systemPrompt = `You are LovellyLilly AI. Based on this question and answer, suggest 3 short, curious, and specific follow-up questions the user might naturally want to ask next. Return ONLY a valid JSON array of exactly 3 strings. No explanation, no markdown, no code fences. Example: ["What are the side effects?", "How long does it take?", "Is there a cheaper alternative?"]`;
    
    const res = await model.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(`Question: ${query}\nAnswer: ${response}`)
    ]);
    try {
        // Find JSON array in response if model adds fluff
        const jsonMatch = res.content.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(res.content);
    } catch (e) {
        console.error("Error parsing follow-ups:", e);
        return ["How does this work?", "Give me an example", "Summarize this"];
    }
};
