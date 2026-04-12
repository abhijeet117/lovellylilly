const GeneratedWebsite = require("../models/GeneratedWebsite.model");
const geminiService = require("../services/gemini.service");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

const VALID_TYPES = ["landing-page", "portfolio", "saas", "blog", "e-commerce", "dashboard", "other"];

exports.generateWebsite = asyncHandler(async (req, res, next) => {
    const { prompt, type } = req.body;

    if (!prompt) return next(new AppError("Prompt is required", 400));

    // Normalise type — fall back to "other" for unrecognised values
    const siteType = VALID_TYPES.includes(type) ? type : "other";

    const result = await geminiService.generateWebsite(prompt, siteType);

    const website = await GeneratedWebsite.create({
        user: req.user.id,
        prompt,
        title: result.title,
        fullHtml: result.fullHtml,
        type: result.type,
    });

    res.status(201).json({
        status: "success",
        data: { website },
    });
});

exports.previewWebsite = asyncHandler(async (req, res, next) => {
    const website = await GeneratedWebsite.findOne({ 
        _id: req.params.websiteId, 
        user: req.user.id 
    });

    if (!website) return next(new AppError("No website found with that ID", 404));

    res.setHeader("Content-Type", "text/html");
    res.send(website.fullHtml);
});

exports.getMyWebsites = asyncHandler(async (req, res, next) => {
    const websites = await GeneratedWebsite.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json({ status: "success", data: { websites } });
});

exports.deleteWebsite = asyncHandler(async (req, res, next) => {
    const website = await GeneratedWebsite.findOneAndDelete({ 
        _id: req.params.websiteId, 
        user: req.user.id 
    });

    if (!website) return next(new AppError("No website found with that ID", 404));

    res.status(204).json({ status: "success", data: null });
});
