import { eq } from 'drizzle-orm';
import { db } from '../client';
import { conversations, messages, type Message, type NewMessage } from '../schema';

export const conversationRepo = {
  createConversation: () =>
    db ? db.insert(conversations).values({}).returning() : Promise.resolve([]),

  getMessages: (conversationId: number) =>
    db
      ? db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt)
      : Promise.resolve([]),

  addMessage: (data: NewMessage) =>
    db ? db.insert(messages).values(data).returning() : Promise.resolve([]),

  deleteConversation: (id: number) => {
    if (!db) return Promise.resolve([]);
    db.delete(messages).where(eq(messages.conversationId, id));
    return db.delete(conversations).where(eq(conversations.id, id));
  },
};
