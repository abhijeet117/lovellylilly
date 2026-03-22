const axios = require('axios');
require('dotenv').config();

async function testMiniMaxChina() {
    const url = "https://api.minimax.io/v1/text/chatcompletion_v2";
    console.log(`Testing Chinese MiniMax with URL: ${url}`);
    
    try {
        const response = await axios.post(url, {
            model: "abab6.5s-chat",
            messages: [{ role: "user", content: "hi" }]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Success (China):", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("Error (China):", err.response ? err.response.status : err.message);
        if (err.response) {
            console.error("Data:", JSON.stringify(err.response.data, null, 2));
        }
    }
}

testMiniMaxChina();
