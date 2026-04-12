const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const AppError = require("../utils/AppError");

// LangChain providers — used for website/doc generation with multi-provider fallback
const { ChatMistralAI } = require("@langchain/mistralai");
const { ChatOpenAI } = require("@langchain/openai");
const { ChatAnthropic } = require("@langchain/anthropic");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");

let ChatGoogleGenerativeAI = null;

try {
    ({ ChatGoogleGenerativeAI } = require("@langchain/google-genai"));
} catch (error) {
    console.warn("[gemini.service] Gemini adapter unavailable:", error.message);
}

// Lazy-init Gemini SDK (only needed for chatWithDocument's multi-turn chat)
let _genAI = null;
const getGenAI = () => {
    if (!_genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new AppError("GEMINI_API_KEY is not configured", 500);
        }
        _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return _genAI;
};

// ── Multi-provider fallback for text generation ──────────────────────────────
// Tries providers in order until one succeeds. Quota / auth errors advance to next.
const PROVIDER_CHAIN = [
    () => process.env.GEMINI_API_KEY && ChatGoogleGenerativeAI && new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash",      apiKey: process.env.GEMINI_API_KEY }),
    () => process.env.MISTRAL_API_KEY && new ChatMistralAI({ model: "mistral-large-latest",           apiKey: process.env.MISTRAL_API_KEY }),
    () => process.env.OPENAI_API_KEY  && new ChatOpenAI({ modelName: "gpt-4o-mini",                   openAIApiKey: process.env.OPENAI_API_KEY }),
    () => process.env.ANTHROPIC_API_KEY && new ChatAnthropic({ modelName: "claude-haiku-4-5-20251001", anthropicApiKey: process.env.ANTHROPIC_API_KEY }),
];

const isQuotaOrAuthError = (err) =>
    /429|quota|rate.?limit|too many|resource.?exhausted/i.test(err.message) ||
    /401|403|unauthorized|invalid.*key|api.?key/i.test(err.message);

const generateWithFallback = async (systemPrompt, userPrompt) => {
    let lastErr;
    for (const factory of PROVIDER_CHAIN) {
        const model = factory();
        if (!model) continue;
        try {
            const result = await model.pipe(new StringOutputParser()).invoke([
                new SystemMessage(systemPrompt),
                new HumanMessage(userPrompt),
            ]);
            return result;
        } catch (err) {
            lastErr = err;
            if (isQuotaOrAuthError(err)) {
                console.warn(`[gemini.service] Provider failed (${err.message?.slice(0, 80)}), trying next…`);
                continue;
            }
            throw err; // unexpected error — surface immediately
        }
    }
    throw lastErr || new Error("All AI providers failed or are unconfigured.");
};

// ── Image Generation via Pollinations.ai ────────────────────────────────────

// Map aspect ratio strings to pixel dimensions
const ASPECT_DIMENSIONS = {
    "1:1":  { width: 1024, height: 1024 },
    "16:9": { width: 1280, height: 720 },
    "9:16": { width: 720, height: 1280 },
};

// Auth header for Pollinations API (removes rate limits, watermark)
const pollinationsHeaders = () => {
    const key = process.env.POLLINATIONS_API_KEY;
    return key ? { Authorization: `Bearer ${key}` } : {};
};

exports.generateImage = async (prompt, aspectRatio = "1:1", style = "realistic") => {
    try {
        const dims = ASPECT_DIMENSIONS[aspectRatio] || ASPECT_DIMENSIONS["1:1"];
        const fullPrompt = `Style: ${style}. ${prompt}. High quality, detailed, professional.`;
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const keyParam = process.env.POLLINATIONS_API_KEY ? `&key=${process.env.POLLINATIONS_API_KEY}` : "";

        // Pollinations GET endpoint returns the image directly at this URL
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dims.width}&height=${dims.height}&model=flux&nologo=true&private=true${keyParam}`;

        // Trigger generation with a HEAD request (Pollinations generates on first request)
        const response = await axios.head(imageUrl, {
            timeout: 120000,
            maxRedirects: 5,
            headers: pollinationsHeaders()
        });
        if (response.status !== 200) {
            throw new AppError("Pollinations image generation returned non-200 status", 500);
        }

        return {
            imageData: imageUrl, // URL string — stored in DB and used as <img src>
            revisedPrompt: fullPrompt
        };
    } catch (error) {
        console.error("Pollinations Image Gen Error:", error.message);
        throw new AppError(error.message || "Image generation failed", 500);
    }
};

// ── Video Generation via Pollinations.ai ────────────────────────────────────

exports.generateVideo = async (prompt, aspectRatio = "16:9") => {
    try {
        const encodedPrompt = encodeURIComponent(prompt);
        const keyParam = process.env.POLLINATIONS_API_KEY ? `&key=${process.env.POLLINATIONS_API_KEY}` : "";
        // Pollinations video endpoint — returns MP4 directly
        const videoUrl = `https://video.pollinations.ai/prompt/${encodedPrompt}?model=wan&aspectRatio=${aspectRatio}&duration=5&private=true${keyParam}`;

        // Trigger generation with a HEAD request
        await axios.head(videoUrl, { timeout: 180000, maxRedirects: 5, headers: pollinationsHeaders() }).catch(() => {
            // Video may take longer; the URL is still valid for later retrieval
        });

        return {
            operationId: videoUrl, // Use the URL as the operation reference
            videoUrl
        };
    } catch (error) {
        console.error("Pollinations Video Gen Error:", error.message);
        throw new AppError(error.message || "Video generation failed", 500);
    }
};

exports.pollVideoStatus = async (operationId) => {
    try {
        // operationId is now the Pollinations video URL
        const response = await axios.head(operationId, { timeout: 30000, maxRedirects: 5 }).catch(() => null);
        if (response && response.status === 200) {
            return {
                status: "completed",
                videoUrl: operationId,
                thumbnailUrl: null
            };
        }
        return { status: "processing", videoUrl: null, thumbnailUrl: null };
    } catch (error) {
        throw new AppError("Failed to check video status", 500);
    }
};

// ── Website Generation (uses Gemini for HTML generation) ────────────────────

const stripCodeFences = (text) => {
    // Remove ```html ... ``` or ``` ... ``` wrappers Gemini sometimes adds
    return text
        .replace(/^```(?:html)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();
};

exports.generateWebsite = async (prompt, type = "landing-page") => {
    const systemPrompt = `You are LovellyLilly AI's website builder.
Generate a complete, beautiful, single-file HTML website with embedded CSS and JavaScript.
Rules:
- Return ONLY the raw HTML document starting with <!DOCTYPE html>
- No markdown, no explanations, no code fences (no triple backticks)
- Must include: responsive design, attractive styling, real content (no lorem ipsum)
- Use a modern dark or light theme appropriate for the website type
- Include smooth animations or hover effects where suitable
- Website type: ${type}`;

    try {
        let fullHtml = stripCodeFences(await generateWithFallback(systemPrompt, prompt));

        if (!fullHtml.toLowerCase().includes("<html")) {
            throw new Error("AI returned non-HTML content — retrying may help");
        }

        const titleMatch = fullHtml.match(/<title[^>]*>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : `${type.replace(/-/g, " ")} website`;

        return { fullHtml, title, type };
    } catch (error) {
        console.error("Website Gen Error:", error.message || error);
        throw new AppError(
            isQuotaOrAuthError(error)
                ? "All AI providers are currently rate-limited. Please try again in a minute."
                : `Website generation failed: ${error.message || "unknown error"}`,
            500
        );
    }
};

// ── Document Chat (still uses Gemini for RAG-style Q&A) ─────────────────────

exports.chatWithDocument = async (parsedText, chatHistory, userQuestion, _systemPromptOverride) => {
    const systemPrompt = `You are LovellyLilly AI in document analysis mode.
Answer the user's question based solely on the document content below.
Always reference specific parts of the document. Never fabricate content.
If the answer is not in the document, say so clearly.

Document Content:
${parsedText.substring(0, 48000)}`;

    // Build a simple history suffix so the model sees prior turns
    const historyText = chatHistory.length > 0
        ? chatHistory.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n")
        : "";

    const userPrompt = historyText
        ? `Previous conversation:\n${historyText}\n\nUser question: ${userQuestion}`
        : userQuestion;

    try {
        return await generateWithFallback(systemPrompt, userPrompt);
    } catch (error) {
        console.error("Doc Chat Error:", error.message);
        throw new AppError(
            isQuotaOrAuthError(error)
                ? "AI service is rate-limited. Please try again in a moment."
                : "Failed to chat with document",
            500
        );
    }
};
