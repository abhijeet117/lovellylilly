/**
 * Image Generation Service
 *
 * Provider chain (tries in order):
 *   1. Cloudflare Workers AI — @cf/black-forest-labs/flux-1-schnell (free tier: ~10 000 neurons/day)
 *   2. Pollinations.ai       — flux model, no-auth or with POLLINATIONS_API_KEY
 *
 * Generated images are uploaded to Cloudinary and the public URL is returned.
 * Cloudinary credentials must be set: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const AppError = require("../utils/AppError");

// ── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// ── Aspect-ratio → pixel dimensions ─────────────────────────────────────────
// Cloudflare flux-1-schnell supports width/height in range [256, 1024] & multiples of 8
const ASPECT_DIMENSIONS = {
    "1:1":  { width: 1024, height: 1024 },
    "16:9": { width: 1024, height: 576 },   // closest CF-supported size
    "9:16": { width: 576,  height: 1024 },
    "4:3":  { width: 1024, height: 768 },
    "3:4":  { width: 768,  height: 1024 },
};

// ── Upload buffer to Cloudinary ──────────────────────────────────────────────
const uploadBufferToCloudinary = (buffer, mimeType = "image/png") => {
    return new Promise((resolve, reject) => {
        const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
        cloudinary.uploader.upload(
            dataUri,
            {
                folder: "lovelylilly/generated",
                resource_type: "image",
                overwrite: false,
            },
            (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            }
        );
    });
};

// ── Provider 1: Cloudflare Workers AI ────────────────────────────────────────
const generateWithCloudflare = async (prompt, dims) => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken  = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
        throw new Error("CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN not configured");
    }

    // flux-1-schnell: fast, high quality, free tier friendly (4 steps recommended)
    const model = "@cf/black-forest-labs/flux-1-schnell";
    const url   = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

    const response = await axios.post(
        url,
        {
            prompt,
            num_steps: 4,             // 1-8; 4 is fast with good quality
            width:  dims.width,
            height: dims.height,
        },
        {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            responseType: "arraybuffer",   // image comes back as raw binary
            timeout: 90000,
        }
    );

    // Cloudflare returns raw PNG bytes; upload to Cloudinary
    const buffer   = Buffer.from(response.data);
    const imageUrl = await uploadBufferToCloudinary(buffer, "image/png");
    return imageUrl;
};

// ── Provider 2: Pollinations.ai (fixed — GET with stream) ───────────────────
const generateWithPollinations = async (prompt, dims) => {
    const encodedPrompt = encodeURIComponent(prompt);
    const apiKey = process.env.POLLINATIONS_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${dims.width}&height=${dims.height}&model=flux&nologo=true&private=true${keyParam}`;

    // Use GET to actually download the image, then re-host on Cloudinary for reliability
    const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        timeout: 120000,
        maxRedirects: 5,
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
    });

    const contentType = response.headers["content-type"] || "image/jpeg";
    if (!contentType.startsWith("image/")) {
        throw new Error(`Pollinations returned non-image content-type: ${contentType}`);
    }

    const buffer = Buffer.from(response.data);

    // Re-host on Cloudinary so the URL is stable and doesn't expire
    try {
        const hostedUrl = await uploadBufferToCloudinary(buffer, contentType);
        return hostedUrl;
    } catch (cloudinaryErr) {
        // If Cloudinary upload fails, fall back to raw Pollinations URL
        console.warn("[imageService] Cloudinary upload failed, using raw Pollinations URL:", cloudinaryErr.message);
        return imageUrl;
    }
};

// ── Main export ──────────────────────────────────────────────────────────────
exports.generateImage = async (prompt, aspectRatio = "1:1", style = "realistic") => {
    const dims = ASPECT_DIMENSIONS[aspectRatio] || ASPECT_DIMENSIONS["1:1"];
    const fullPrompt = `${style} style. ${prompt}. Highly detailed, professional quality, sharp focus.`;

    // ── Try Cloudflare first ─────────────────────────────────────────────────
    const hasCloudflare = !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN);

    if (hasCloudflare) {
        try {
            console.log("[imageService] Generating via Cloudflare Workers AI…");
            const imageUrl = await generateWithCloudflare(fullPrompt, dims);
            console.log("[imageService] Cloudflare OK →", imageUrl);
            return { imageData: imageUrl, revisedPrompt: fullPrompt, provider: "cloudflare" };
        } catch (err) {
            console.warn("[imageService] Cloudflare failed, falling back to Pollinations:", err.message);
        }
    }

    // ── Fallback: Pollinations ───────────────────────────────────────────────
    try {
        console.log("[imageService] Generating via Pollinations.ai…");
        const imageUrl = await generateWithPollinations(fullPrompt, dims);
        console.log("[imageService] Pollinations OK →", imageUrl);
        return { imageData: imageUrl, revisedPrompt: fullPrompt, provider: "pollinations" };
    } catch (err) {
        console.error("[imageService] Pollinations also failed:", err.message);
        throw new AppError(`Image generation failed: ${err.message}`, 500);
    }
};
