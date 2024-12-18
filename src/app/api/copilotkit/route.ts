import { Request, Response } from 'express';
import OpenAI from 'openai';

export async function POST(req: Request, res: Response): Promise<Response> {
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: "Create a simple presentation outline about technology.",
            max_tokens: 500,
            temperature: 0.7,
        });
        res.send(completion.choices[0].text);
    } catch (error) {
        console.error(error);
        if (error instanceof OpenAI.APIError) {
            return res.status(error.status).send(error.message);
        }
        return res.status(500).send('Internal Server Error');
    }
}