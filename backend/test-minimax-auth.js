const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

async function test(authType) {
    try {
        console.log(`Testing MiniMax V2 with authType: ${authType}`);
        const authHeader = authType === "bearer" 
            ? `Bearer ${process.env.MINIMAX_API_KEY}` 
            : `${process.env.MINIMAX_API_KEY}`;
            
        const res = await axios.post("https://api.minimax.chat/v1/text/chatcompletion_v2", {
            model: "minimax-m2.5",
            messages: [{ role: "user", content: "Hi" }]
        }, {
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/json"
            }
        });
        console.log(`SUCCESS (${authType}):`, JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error(`FAILED (${authType}):`, err.response?.data || err.message);
    }
}

async function run() {
    await test("bearer");
    await test("direct");
}

run();
