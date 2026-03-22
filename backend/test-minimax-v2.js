const axios = require('axios');
require('dotenv').config();

async function testMiniMaxV2() {
    const url = "https://api.minimax.chat/v1/text/chatcompletion_v2";
    console.log(`Testing MiniMax V2 with URL: ${url}`);
    
    try {
        const response = await axios.post(url, {
            model: "minimax-m2.5",
            messages: [{ role: "user", content: "hi" }]
        }, {
            headers: {
                "Authorization": process.env.MINIMAX_API_KEY,
                "Content-Type": "application/json"
            }
        });
        console.log("Success (V2):", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("Error (V2):", err.response ? err.response.status : err.message);
        if (err.response) {
            console.error("Data:", JSON.stringify(err.response.data, null, 2));
        }
    }
}

testMiniMaxV2();
