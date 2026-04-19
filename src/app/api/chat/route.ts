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

    const response = await ai.generate({
      system: `You are StockBro AI, a concise and knowledgeable financial assistant embedded in the StockBro trading dashboard.
- Help users understand stocks, markets, portfolios, charts, and trading concepts.
- Explain AI-driven analytics and technical indicators in plain language.
- When asked for predictions, give balanced takes and always note that this is educational guidance, not financial advice.
- Prefer short, scannable answers with bullet points when useful.
- If you do not know a current market price, say so — do not fabricate data.`,
      messages: genkitMessages,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 });
  }
}
