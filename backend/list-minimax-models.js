const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

async function test() {
    try {
        console.log("Listing models via OpenAI-compatible endpoint...");
        const response = await axios.get("https://api.minimax.chat/v1/openai/models", {
            headers: {
                "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`
            }
        });
        
        console.log("Models:", JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error("List Models Error:", err.response?.data || err.message);
    }
}

test();
