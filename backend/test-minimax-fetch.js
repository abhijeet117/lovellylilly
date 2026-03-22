const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

async function test() {
    const url = "https://api.minimax.chat/v1/text/chatcompletion_v2";
    const body = {
        model: "minimax-m2.5",
        messages: [{ role: "user", content: "Hi" }]
    };
    
    try {
        console.log("Testing with node-fetch...");
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

test();
