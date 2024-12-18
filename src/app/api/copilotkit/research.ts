import OpenAI from 'openai';
import axios from 'axios';

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const researchFunction = async (query: string) => {
    try {
        // Example API call, replace with your actual API endpoint
        const response = await axios.post('https://api.example.com/research', { query });
        return response.data; // Return the data received from the API
    } catch (error) {
        console.error('Research error:', error);
        return 'An error occurred during research.';
    }
};

export default researchFunction;