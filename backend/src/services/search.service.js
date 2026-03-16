const axios = require("axios");

exports.search = async (query) => {
    try {
        const response = await axios.post("https://api.tavily.com/search", {
            api_key: process.env.TAVILY_API_KEY,
            query: query,
            search_depth: "advanced",
            include_images: false,
            include_answer: true,
            max_results: 5
        });

        return response.data.results.map(result => ({
            title: result.title,
            url: result.url,
            domain: new URL(result.url).hostname,
            snippet: result.content,
            favicon: `https://www.google.com/s2/favicons?domain=${new URL(result.url).hostname}&sz=128`
        }));
    } catch (error) {
        console.error("Tavily Search Error:", error.response?.data || error.message);
        return [];
    }
};
