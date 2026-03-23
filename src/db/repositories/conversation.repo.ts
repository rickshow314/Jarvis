import { eq } from 'drizzle-orm';
import { db } from '../client';
import { conversations, messages, type Message, type NewMessage } from '../schema';

export const conversationRepo = {
  createConversation: () =>
    db.insert(conversations).values({}).returning(),

  getMessages: (conversationId: number) =>
    db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt),

  addMessage: (data: NewMessage) =>
    db.insert(messages).values(data).returning(),

  deleteConversation: (id: number) => {
    db.delete(messages).where(eq(messages.conversationId, id));
    return db.delete(conversations).where(eq(conversations.id, id));
  },
};
