import { create } from 'zustand';
import type { ChatMessage } from '../ai/provider.interface';
import { geminiProvider } from '../ai/gemini';
import { buildSystemPrompt } from '../ai/prompt-builder';
import { conversationRepo } from '../db/repositories/conversation.repo';
import { taskRepo } from '../db/repositories/task.repo';
import { eventRepo } from '../db/repositories/event.repo';
import type { NewTask } from '../db/schema';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOffline: boolean;
  conversationId: number | null;
  setOffline: (v: boolean) => void;
  initConversation: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  isOffline: false,
  conversationId: null,

  setOffline: (v) => set({ isOffline: v }),

  initConversation: async () => {
    const [conv] = await conversationRepo.createConversation();
    set({ conversationId: conv.id, messages: [] });
  },

  sendMessage: async (text: string) => {
    const { messages, conversationId, isOffline } = get();
    const userMsg: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    set({ messages: updatedMessages, isLoading: true });

    if (conversationId) {
      await conversationRepo.addMessage({
        conversationId,
        role: 'user',
        content: text,
      });
    }

    if (isOffline) {
      const offlineReply: ChatMessage = {
        role: 'assistant',
        content: "I'm offline right now — your message is saved and I'll respond when reconnected.",
      };
      set({ messages: [...updatedMessages, offlineReply], isLoading: false });
      return;
    }

    try {
      const allTasks = await taskRepo.getAll();
      const allEvents = await eventRepo.getAll();
      const systemPrompt = buildSystemPrompt(allTasks, allEvents);
      const responseText = await geminiProvider.sendMessage(updatedMessages, systemPrompt);

      // Parse AI action if present
      let displayText = responseText;
      if (responseText.startsWith('ACTION:')) {
        const firstNewline = responseText.indexOf('\n');
        const jsonStr = responseText.slice(7, firstNewline > 0 ? firstNewline : undefined);
        try {
          const action = JSON.parse(jsonStr);
          displayText = firstNewline > 0 ? responseText.slice(firstNewline + 1).trim() : 'Done!';
          if (action.action === 'create_task') {
            const newTask: NewTask = {
              title: action.title,
              category: action.category ?? 'personal',
              priority: action.priority ?? 'P2',
              dueDate: action.dueDate ?? null,
            };
            await taskRepo.create(newTask);
          }
        } catch {
          // Not valid JSON — treat as plain text
        }
      }

      const assistantMsg: ChatMessage = { role: 'assistant', content: displayText };
      if (conversationId) {
        await conversationRepo.addMessage({
          conversationId,
          role: 'assistant',
          content: displayText,
        });
      }
      set({ messages: [...updatedMessages, assistantMsg], isLoading: false });
    } catch (err) {
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: 'Something went wrong — please try again.',
      };
      set({ messages: [...updatedMessages, errMsg], isLoading: false });
    }
  },

  clearMessages: () => set({ messages: [] }),
}));
