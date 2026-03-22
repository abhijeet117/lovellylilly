const axios = require('axios');
require('dotenv').config();

const headersToTest = [
    { name: "Authorization", value: `Bearer ${process.env.MINIMAX_API_KEY}` },
    { name: "Authorization", value: process.env.MINIMAX_API_KEY },
    { name: "api-key", value: process.env.MINIMAX_API_KEY },
    { name: "x-api-key", value: process.env.MINIMAX_API_KEY },
];

async function bruteForceHeaders() {
    const url = "https://api.minimax.chat/v1/text/chatcompletion_v2";
    
    for (const h of headersToTest) {
        console.log(`Testing header: ${h.name} = ${h.value.substring(0, 10)}...`);
        try {
            const response = await axios.post(url, {
                model: "minimax-m2.5",
                messages: [{ role: "user", content: "hi" }]
            }, {
                headers: {
                    [h.name]: h.value,
                    "Content-Type": "application/json"
                }
            });
            console.log(`SUCCESS with ${h.name}!`, JSON.stringify(response.data, null, 2));
            return;
        } catch (err) {
            console.log(`Failed with ${h.name}: ${err.response ? JSON.stringify(err.response.data.base_resp) : err.message}`);
        }
    }
}

bruteForceHeaders();
