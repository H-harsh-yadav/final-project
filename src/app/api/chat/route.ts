import { ai } from '@/ai/genkit';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Format messages for Genkit. 
    // Assuming messages from frontend look like: { role: 'user' | 'model', content: string }
    const genkitMessages = messages.map((m: any) => ({
      role: m.role,
      content: [{ text: m.content }]
    }));

    // Generate response using Genkit
    const response = await ai.generate({
      // We need to provide the prompt and history.
      // Genkit accepts an array of messages natively if it's the `messages` array in generate options
      messages: genkitMessages,
      // You can define a system prompt as the first message if needed, or explicitly pass it to generate
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
  }
}
