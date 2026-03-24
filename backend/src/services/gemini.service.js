const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const AppError = require("../utils/AppError");

// Lazy-init Gemini SDK: avoid crash at module load if GEMINI_API_KEY is not yet set
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

// ── Website Generation (still uses Gemini for HTML generation) ──────────────

exports.generateWebsite = async (prompt, type = "landing-page") => {
    try {
        const model = getGenAI().getGenerativeModel({ model: process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash" });

        const systemPrompt = `You are LovellyLilly AI's website builder. Generate a complete, beautiful, single-file HTML website with embedded CSS and JavaScript. Return ONLY valid HTML — no markdown, no explanation, no code fences. The website must be fully functional, responsive, and visually impressive. Website Type: ${type}`;

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: prompt }
        ]);

        const fullHtml = result.response.text().trim();

        // Extract title
        const titleMatch = fullHtml.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : `Generated ${type}`;

        return { fullHtml, title, type };
    } catch (error) {
        console.error("Gemini Website Gen Error:", error);
        throw new AppError("Website generation failed", 500);
    }
};

// ── Document Chat (still uses Gemini for RAG-style Q&A) ─────────────────────

exports.chatWithDocument = async (parsedText, chatHistory, userQuestion) => {
    try {
        const model = getGenAI().getGenerativeModel({ model: process.env.GEMINI_VISION_MODEL || "gemini-2.0-flash" });

        const systemPrompt = `You are LovellyLilly AI in document analysis mode. The user has uploaded a document. Answer questions about it accurately. Always reference specific parts of the document. Never fabricate document content. If the answer isn't in the document, say so clearly.

        Document Content (Partial):
        ${parsedText.substring(0, 50000)}`;

        const history = chatHistory.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 2048,
            },
        });

        const result = await chat.sendMessage(userQuestion);
        return result.response.text();
    } catch (error) {
        console.error("Gemini Doc Chat Error:", error);
        throw new AppError("Failed to chat with document", 500);
    }
};
