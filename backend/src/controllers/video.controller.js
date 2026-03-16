const GeneratedVideo = require("../models/GeneratedVideo.model");
const geminiService = require("../services/gemini.service");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.generateVideo = asyncHandler(async (req, res, next) => {
    const { prompt, aspectRatio } = req.body;

    if (!prompt) return next(new AppError("Prompt is required", 400));

    const { operationId } = await geminiService.generateVideo(prompt, aspectRatio);

    const video = await GeneratedVideo.create({
        user: req.user.id,
        prompt,
        aspectRatio,
        operationId,
        status: "pending"
    });

    res.status(202).json({
        status: "success",
        data: { video }
    });
});

exports.checkVideoStatus = asyncHandler(async (req, res, next) => {
    let video = await GeneratedVideo.findOne({ 
        _id: req.params.videoId, 
        user: req.user.id 
    });

    if (!video) return next(new AppError("No video found with that ID", 404));

    if (video.status === "pending" || video.status === "processing") {
        const result = await geminiService.pollVideoStatus(video.operationId);
        
        if (result.status === "completed") {
            video = await GeneratedVideo.findByIdAndUpdate(video._id, {
                status: "completed",
                videoUrl: result.videoUrl,
                thumbnailUrl: result.thumbnailUrl
            }, { new: true });
        } else if (result.status === "failed") {
            video = await GeneratedVideo.findByIdAndUpdate(video._id, {
                status: "failed",
                errorMessage: result.message
            }, { new: true });
        }
    }

    res.status(200).json({
        status: "success",
        data: { video }
    });
});

exports.getMyVideos = asyncHandler(async (req, res, next) => {
    const videos = await GeneratedVideo.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json({ status: "success", data: { videos } });
});

exports.deleteVideo = asyncHandler(async (req, res, next) => {
    const video = await GeneratedVideo.findOneAndDelete({ 
        _id: req.params.videoId, 
        user: req.user.id 
    });

    if (!video) return next(new AppError("No video found with that ID", 404));

    res.status(204).json({ status: "success", data: null });
});
