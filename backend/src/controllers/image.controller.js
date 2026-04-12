const GeneratedImage = require("../models/GeneratedImage.model");
const imageService   = require("../services/image.service");
const asyncHandler   = require("../middleware/asyncHandler");
const AppError       = require("../utils/AppError");

exports.generateImage = asyncHandler(async (req, res, next) => {
    const { prompt, aspectRatio, style } = req.body;

    if (!prompt) return next(new AppError("Prompt is required", 400));

    const startTime = Date.now();
    const result    = await imageService.generateImage(prompt, aspectRatio, style);
    const generationTimeMs = Date.now() - startTime;

    const newImage = await GeneratedImage.create({
        user:          req.user.id,
        prompt,
        revisedPrompt: result.revisedPrompt,
        imageUrl:      result.imageData,   // Cloudinary or Pollinations URL
        aspectRatio,
        style,
        generationTimeMs,
    });

    res.status(201).json({
        status: "success",
        data:   { image: newImage },
    });
});

exports.getMyImages = asyncHandler(async (req, res, next) => {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const images = await GeneratedImage.find({ user: req.user.id })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        status: "success",
        results: images.length,
        data: { images },
    });
});

exports.deleteImage = asyncHandler(async (req, res, next) => {
    const image = await GeneratedImage.findOneAndDelete({
        _id:  req.params.imageId,
        user: req.user.id,
    });

    if (!image) return next(new AppError("No image found with that ID", 404));

    res.status(204).json({ status: "success", data: null });
});
