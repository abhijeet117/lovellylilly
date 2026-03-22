const dotenv = require("dotenv");
dotenv.config();
const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage } = require("@langchain/core/messages");

const models = ["abab6.5-chat", "abab6.5s-chat", "minimax-m1", "abab5.5-chat"];

async function test() {
    for (const modelName of models) {
        try {
            console.log(`Testing MiniMax (${modelName})...`);
            const model = new ChatOpenAI({
                modelName: modelName,
                openAIApiKey: process.env.MINIMAX_API_KEY,
                configuration: {
                    baseURL: "https://api.minimax.chat/v1/openai",
                }
            });
            const res = await model.invoke([new HumanMessage("Hi")]);
            console.log(`SUCCESS with ${modelName}:`, res.content);
            return;
        } catch (err) {
            console.error(`FAILED with ${modelName}:`, err.message || err);
        }
    }
}

test();
