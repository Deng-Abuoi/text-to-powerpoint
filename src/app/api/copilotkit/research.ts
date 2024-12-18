import OpenAI from 'openai';
import axios from 'axios';
import { useCopilotContext } from 'some-context'; // Remove if not used

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const researchFunction = async (query: string) => {
    try {
        const response = await axios.post('https://api.example.com/research', { query });
        return response.data;
    } catch (error) {
        console.error('Research error:', error);
        return 'An error occurred during research.';
    }
};

export default researchFunction;
