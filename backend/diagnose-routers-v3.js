const express = require('express');

function test(name, path) {
    try {
        console.log(`[${name}] Requiring...`);
        const r = require(path);
        console.log(`[${name}] Required. Mounting...`);
        const app = express();
        app.use(r);
        console.log(`[${name}] Mounted successfully.`);
    } catch (err) {
        console.error(`[${name}] FAILED: ${err.message}`);
        if (err.stack) console.error(err.stack);
    }
}

test("auth", "./src/routes/auth.routes");
test("chat", "./src/routes/chat.routes");
test("message", "./src/routes/message.routes");
test("user", "./src/routes/user.routes");
test("admin", "./src/routes/admin.routes");
test("image", "./src/routes/image.routes");
test("video", "./src/routes/video.routes");
test("website", "./src/routes/website.routes");
test("upload", "./src/routes/upload.routes");
