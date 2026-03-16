const express = require('express');
const proto = express.application;

// Monkeypatch .all
const originalAll = proto.all;
proto.all = function(path, ...args) {
    console.log(`[DEBUG] app.all called with path: ${path} (type: ${typeof path})`);
    return originalAll.apply(this, [path, ...args]);
};

// Monkeypatch .use
const originalUse = proto.use;
proto.use = function(path, ...args) {
    if (typeof path === 'string') {
        console.log(`[DEBUG] app.use called with path: ${path}`);
    } else if (path instanceof RegExp) {
        console.log(`[DEBUG] app.use called with regex: ${path}`);
    }
    return originalUse.apply(this, [path, ...args]);
};

// Monkeypatch .get, .post, etc. (they all use .route or .lazyrouter)
const Router = require('express/lib/router');
const originalRouterUse = Router.use;
Router.use = function(path, ...args) {
    if (typeof path === 'string') {
        console.log(`[DEBUG] router.use called with path: ${path}`);
    }
    return originalRouterUse.apply(this, [path, ...args]);
};

// Now run the server
require('./server.js');
