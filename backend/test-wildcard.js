const express = require('express');
const app = express();
try {
    app.all('(.*)', (req, res) => res.send('ok'));
    console.log('Path-to-regexp OK with (.*)');
} catch (err) {
    console.error('Path-to-regexp FAILED with *: ' + err.message);
}
