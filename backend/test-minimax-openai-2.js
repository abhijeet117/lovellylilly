const axios = require('axios');
require('dotenv').config();

async function testMiniMaxOpenAI() {
    const url = "https://api.minimax.chat/v1/chat/completions";
    console.log(`Testing MiniMax OpenAI-compatible with URL: ${url}`);
    
    try {
        const response = await axios.post(url, {
            model: "minimax-m2.5",
            messages: [{ role: "user", content: "hi" }]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Success:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("Error:", err.response ? err.response.status : err.message);
        if (err.response) {
            console.error("Data:", JSON.stringify(err.response.data, null, 2));
        }
    }
}

testMiniMaxOpenAI();
