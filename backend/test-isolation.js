const express = require('express');

function t(name, path) {
    try {
        console.log(`Testing ${name}...`);
        require(path);
        console.log(`OK: ${name}`);
    } catch (err) {
        console.error(`FAILED: ${name}`);
        console.error(err.message);
        if (err.stack) console.error(err.stack);
    }
}

t("auth.routes", "./src/routes/auth.routes");
t("chat.routes", "./src/routes/chat.routes");
t("message.routes", "./src/routes/message.routes");
t("user.routes", "./src/routes/user.routes");
t("admin.routes", "./src/routes/admin.routes");
t("image.routes", "./src/routes/image.routes");
t("video.routes", "./src/routes/video.routes");
t("website.routes", "./src/routes/website.routes");
t("upload.routes", "./src/routes/upload.routes");
t("ai.service", "./src/services/ai.service");
t("socket.service", "./src/services/socket.service");
