const { GoogleGenerativeAI } = require("@google/generative-ai");
const AppError = require("../utils/AppError");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateImage = async (prompt, aspectRatio = "1:1", style = "realistic") => {
    try {
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_IMAGE_MODEL || "imagen-3.0-generate-002" });
        
        // Quality booster suffix
        const qualityBooster = "High quality, detailed, professional. LovellyLilly AI generation.";
        const fullPrompt = `Style: ${style}. Aspect Ratio: ${aspectRatio}. Prompt: ${prompt}. ${qualityBooster}`;
        
        // Note: Imagen 3 API via Node SDK might vary depending on specific library version/features.
        // This is a standard structure for generative models. 
        // Some Imagen implementations use different endpoints or methods.
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        // This usually returns a base64 or a URL depending on the specific implementation
        // For Imagen 3 specifically, it might return image data in the response candidates.
        const imageData = response.candidates[0]?.content?.parts[0]?.inlineData?.data;
        
        if (!imageData) {
            throw new AppError("Failed to generate image data", 500);
        }

        return {
            imageData: imageData,
            revisedPrompt: fullPrompt
        };
    } catch (error) {
        console.error("Gemini Image Gen Error:", error);
        throw new AppError(error.message || "Image generation failed", 500);
    }
};

exports.generateVideo = async (prompt, aspectRatio = "16:9") => {
    try {
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_VIDEO_MODEL || "veo-2.0-generate-001" });
        
        // Video is usually async
        const result = await model.generateContent(prompt);
        
        // In actual Veo API, this returns an operation/job ID
        const operationId = result.operationId || "mock-op-id-" + Date.now();
        
        return { operationId };
    } catch (error) {
        console.error("Gemini Video Gen Error:", error);
        throw new AppError(error.message || "Video generation failed", 500);
    }
};

exports.pollVideoStatus = async (operationId) => {
    try {
        // Mock polling logic - in real world you'd call the operation endpoint
        // For demonstration, we simulate completion
        return {
            status: "completed",
            videoUrl: "https://storage.googleapis.com/sample-videos/sample-mp4-file.mp4",
            thumbnailUrl: "https://placehold.co/600x400?text=Video+Thumbnail"
        };
    } catch (error) {
        throw new AppError("Failed to check video status", 500);
    }
};

exports.generateWebsite = async (prompt, type = "landing-page") => {
    try {
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_CHAT_MODEL || "gemini-2.0-flash" });
        
        const systemPrompt = `You are LovellyLilly AI's website builder. Generate a complete, beautiful, single-file HTML website with embedded CSS and JavaScript. Return ONLY valid HTML — no markdown, no explanation, no code fences. The website must be fully functional, responsive, and visually impressive. Website Type: ${type}`;

        const result = await model.generateContent([
            { text: systemPrompt },
            { text: prompt }
        ]);
        
        const fullHtml = result.response.text().trim();
        
        // Extract title
        const titleMatch = fullHtml.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : `Generated ${type}`;

        return {
            fullHtml,
            title,
            type
        };
    } catch (error) {
        console.error("Gemini Website Gen Error:", error);
        throw new AppError("Website generation failed", 500);
    }
};

exports.chatWithDocument = async (parsedText, chatHistory, userQuestion) => {
    try {
        const model = genAI.getGenerativeModel({ model: process.env.GEMINI_VISION_MODEL || "gemini-2.0-flash" });
        
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
