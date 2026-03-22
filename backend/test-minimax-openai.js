const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

async function test() {
    const url = "https://api.minimax.chat/v1/openai/chat/completions";
    const body = {
        model: "abab6.5s-chat",
        messages: [{ role: "user", content: "Hi" }]
    };
    
    try {
        console.log("Testing OpenAI-compatible MiniMax endpoint with axios...");
        const response = await axios.post(url, body, {
            headers: {
                "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        
        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("Axios Error:", err.response?.data || err.message);
    }
}

test();
