const express = require('express');

function testRouter(name, path) {
    try {
        console.log(`Testing ${name}...`);
        const router = require(path);
        console.log(`  ${name} required successfully.`);
        const app = express();
        app.use('/', router);
        console.log(`  ${name} mounted successfully on express apps.`);
    } catch (err) {
        console.error(`  ERROR in ${name}:`);
        console.error(err);
        // Do not exit, keep testing others
    }
}

testRouter("authRouter", "./src/routes/auth.routes");
testRouter("chatRouter", "./src/routes/chat.routes");
testRouter("messageRouter", "./src/routes/message.routes");
testRouter("userRouter", "./src/routes/user.routes");
testRouter("adminRouter", "./src/routes/admin.routes");
testRouter("imageRouter", "./src/routes/image.routes");
testRouter("videoRouter", "./src/routes/video.routes");
testRouter("websiteRouter", "./src/routes/website.routes");
testRouter("uploadRouter", "./src/routes/upload.routes");
