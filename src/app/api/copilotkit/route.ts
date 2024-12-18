import { Request, Response } from 'express';

export async function POST(req: Request): Promise<Response> {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Create a simple completion instead of chat
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: "Create a simple presentation outline about technology.",
            max_tokens: 500,
            temperature: 0.7,
        });

        return new Response(JSON.stringify({
            content: completion.choices[0].text
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error: any) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message,
            tip: "If you're seeing rate limit errors, please wait a few minutes and try again."
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
