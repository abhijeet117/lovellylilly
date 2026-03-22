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
        console.log("Testing OpenAI-compatible MiniMax endpoint with Bearer auth...");
        const res1 = await axios.post(url, body, {
            headers: {
                "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Response 1:", JSON.stringify(res1.data, null, 2));
    } catch (err) {
        console.error("Error 1 (Bearer):", err.response?.data || err.message);
    }
    
    try {
        console.log("Testing OpenAI-compatible MiniMax endpoint with direct auth...");
        const res2 = await axios.post(url, body, {
            headers: {
                "Authorization": `${process.env.MINIMAX_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        console.log("Response 2:", JSON.stringify(res2.data, null, 2));
    } catch (err) {
        console.error("Error 2 (Direct):", err.response?.data || err.message);
    }
}

test();
