const axios = require('axios');
require('dotenv').config();

async function testMiniMaxM2() {
    const url = "https://minimax-m2.com/api/v1/chat/completions";
    console.log(`Testing MiniMax-M2 with URL: ${url}`);
    
    try {
        const response = await axios.post(url, {
            model: "MiniMax-M2",
            messages: [{ role: "user", content: "Say hello!" }]
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

testMiniMaxM2();
