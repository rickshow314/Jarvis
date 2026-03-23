export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIProvider {
  sendMessage(messages: ChatMessage[], systemPrompt?: string): Promise<string>;
}
