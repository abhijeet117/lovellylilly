const dotenv = require("dotenv");
dotenv.config();
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage } = require("@langchain/core/messages");

async function test() {
    try {
        console.log("Testing MiniMax (m2.5) with key:", process.env.MINIMAX_API_KEY ? "EXISTS" : "MISSING");
        const model = new ChatOpenAI({
            modelName: "minimax-m2.5",
            openAIApiKey: process.env.MINIMAX_API_KEY,
            configuration: {
                baseURL: "https://api.minimax.chat/v1/openai",
            }
        });
        const res = await model.invoke([new HumanMessage("Hi, who are you?")]);
        console.log("Response:", res.content);
    } catch (err) {
        console.error("MiniMax Test Failed:", err);
    }
}

test();
