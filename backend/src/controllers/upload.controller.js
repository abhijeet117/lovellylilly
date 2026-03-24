const mongoose = require("mongoose");
const Document = require("../models/Document.model");
const documentService = require("../services/document.service");
const geminiService = require("../services/gemini.service");
const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");

exports.uploadDocument = asyncHandler(async (req, res, next) => {
    if (!req.file) return next(new AppError("No file uploaded", 400));

    // Create record in Document collection
    const doc = await Document.create({
        user: req.user.id,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        gridfsId: req.file.id,
        status: "processing"
    });

    // Start parsing in background (or immediately for small files)
    try {
        // GridFS files are stored as chunks in MongoDB.
        // For parsing, we either need to stream it to documentService or download it.
        // Since documentService.parseDocument expects a path, let's update it or use a temp file.
        // To keep it simple as per prompt (no temp files on disk), we should update parseDocument to take a buffer.
        // For now, let's assume we can get the text content.
        
        // This is a simplified version. In a real GridFS setup, you'd stream the file.
        const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "documents" });
        const downloadStream = gfs.openDownloadStream(req.file.id);

        let buffer = Buffer.alloc(0);
        downloadStream.on("data", chunk => buffer = Buffer.concat([buffer, chunk]));
        downloadStream.on("error", async (err) => {
            console.error("GridFS download error:", err);
            doc.status = "failed";
            await doc.save();
        });
        
        downloadStream.on("end", async () => {
            try {
                let parsedText = "";
                const mime = req.file.mimetype;

                if (mime === "application/pdf") {
                    const pdfParse = require("pdf-parse");
                    const data = await pdfParse(buffer);
                    parsedText = data.text;
                } else if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    const mammoth = require("mammoth");
                    const result = await mammoth.extractRawText({ buffer });
                    parsedText = result.value;
                } else if (mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                    const xlsx = require("xlsx");
                    const workbook = xlsx.read(buffer, { type: "buffer" });
                    workbook.SheetNames.forEach(name => {
                        parsedText += xlsx.utils.sheet_to_csv(workbook.Sheets[name]) + "\n";
                    });
                } else if (mime === "text/plain") {
                    parsedText = buffer.toString("utf-8");
                } else {
                    parsedText = buffer.toString("utf-8");
                }

                if (!parsedText.trim()) {
                    parsedText = "Content extracted from " + req.file.originalname;
                }

                doc.parsedText = parsedText;
                doc.wordCount = parsedText.split(/\s+/).length;
                doc.status = "ready";
                await doc.save();
                
                console.log(`Document ${doc._id} parsed and ready`);
            } catch (err) {
                doc.status = "failed";
                await doc.save();
                console.error("Delayed parsing error:", err);
            }
        });

    } catch (err) {
        doc.status = "failed";
        await doc.save();
        return next(new AppError("Parsing initialization failed", 500));
    }

    res.status(201).json({
        status: "success",
        data: { document: { ...doc.toObject(), parsedText: undefined } }
    });
});

exports.getMyDocs = asyncHandler(async (req, res, next) => {
    const docs = await Document.find({ user: req.user.id })
        .select("-parsedText")
        .sort("-createdAt");
    
    res.status(200).json({ status: "success", data: { documents: docs } });
});

exports.deleteDoc = asyncHandler(async (req, res, next) => {
    const doc = await Document.findOne({ _id: req.params.documentId, user: req.user.id });
    
    if (!doc) return next(new AppError("Document not found", 404));

    // Delete from GridFS
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "documents" });
    await gfs.delete(doc.gridfsId);

    // Delete model record
    await Document.findByIdAndDelete(doc._id);

    res.status(204).json({ status: "success", data: null });
});

exports.chatWithDoc = asyncHandler(async (req, res, next) => {
    const question = req.body.question || req.body.message;
    const doc = await Document.findOne({ _id: req.params.documentId, user: req.user.id }).select("+parsedText");

    if (!doc) return next(new AppError("Document not found", 404));
    if (doc.status !== "ready") return next(new AppError("Document is still being processed", 400));
    const systemPrompt = `You are LovellyLilly AI in document analysis mode. The user has uploaded a document. Answer questions about it accurately. Always reference specific parts of the document. Never fabricate document content. If the answer isn't in the document, say so clearly.`;
    
    const answer = await geminiService.chatWithDocument(doc.parsedText, doc.chatHistory, question, systemPrompt);

    doc.chatHistory.push({ role: "user", content: question });
    doc.chatHistory.push({ role: "assistant", content: answer });
    await doc.save();

    res.status(200).json({
        status: "success",
        data: { answer, chatHistory: doc.chatHistory }
    });
});
