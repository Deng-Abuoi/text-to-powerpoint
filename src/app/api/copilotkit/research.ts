import OpenAI from 'openai';
import axios from 'axios';

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function researchWithLangGraph(topic: string): Promise<string> {
    try {
        // Perform Tavily search using direct API call
        const searchResponse = await axios.get('https://api.tavily.com/search', {
            params: {
                api_key: process.env.TAVILY_API_KEY,
                query: topic,
                search_depth: 'basic'
            }
        });

        const searchResults = searchResponse.data.results;

        // Generate summary using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful research assistant. Summarize the following search results concisely."
                },
                {
                    role: "user",
                    content: `Research topic: ${topic}\n\nSearch Results:\n${searchResults.map((result: { title: string; content: string; }) => result.title + ': ' + result.content).join('\n')}`
                }
            ]
        });

        return completion.choices[0].message.content || 'No summary generated.';
    } catch (error) {
        console.error('Research error:', error);
        return 'An error occurred during research.';
    }
}