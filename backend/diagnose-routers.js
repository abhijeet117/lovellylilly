try {
    console.log("Loading authRouter...");
    require("./src/routes/auth.routes");
    console.log("Loading chatRouter...");
    require("./src/routes/chat.routes");
    console.log("Loading messageRouter...");
    require("./src/routes/message.routes");
    console.log("Loading userRouter...");
    require("./src/routes/user.routes");
    console.log("Loading adminRouter...");
    require("./src/routes/admin.routes");
    console.log("Loading imageRouter...");
    require("./src/routes/image.routes");
    console.log("Loading videoRouter...");
    require("./src/routes/video.routes");
    console.log("Loading websiteRouter...");
    require("./src/routes/website.routes");
    console.log("Loading uploadRouter...");
    require("./src/routes/upload.routes");
    console.log("All routers loaded successfully!");
} catch (err) {
    console.error("FAIL!");
    console.error(err);
    process.exit(1);
}
