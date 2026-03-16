const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(path) {
    const result = originalRequire.apply(this, arguments);
    if (path === 'path-to-regexp') {
        const originalPathtoRegexp = result.pathToRegexp;
        result.pathToRegexp = function(path, keys, options) {
            console.log(`[path-to-regexp] Pattern: "${path}"`);
            try {
                return originalPathtoRegexp.apply(this, arguments);
            } catch (err) {
                console.error(`[path-to-regexp] FAILED Pattern: "${path}"`);
                throw err;
            }
        };
    }
    return result;
};

// Now start the server
require('./server.js');
