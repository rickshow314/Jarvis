import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider, ChatMessage } from './provider.interface';
import { secureStorage } from '../utils/secureStorage';

const MODEL_NAME = 'gemini-2.0-flash';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI | null = null;

  private async getClient(): Promise<GoogleGenerativeAI> {
    if (this.client) return this.client;
    const apiKey = await secureStorage.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('Gemini API key not configured. Go to Settings to add it.');
    this.client = new GoogleGenerativeAI(apiKey);
    return this.client;
  }

  async sendMessage(messages: ChatMessage[], systemPrompt?: string): Promise<string> {
    const client = await this.getClient();
    const model = client.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: systemPrompt,
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  }
}

export const geminiProvider = new GeminiProvider();
