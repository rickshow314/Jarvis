import { eq, and, lte } from 'drizzle-orm';
import { db } from '../client';
import { tasks, type Task, type NewTask } from '../schema';

export const taskRepo = {
  getAll: () => db ? db.select().from(tasks).orderBy(tasks.createdAt) : Promise.resolve([]),

  getByCategory: (category: Task['category']) =>
    db ? db.select().from(tasks).where(eq(tasks.category, category)) : Promise.resolve([]),

  getOverdue: () => {
    if (!db) return Promise.resolve([]);
    const now = new Date().toISOString();
    return db
      .select()
      .from(tasks)
      .where(and(eq(tasks.done, false), lte(tasks.dueDate, now)));
  },

  create: (data: NewTask) => db ? db.insert(tasks).values(data).returning() : Promise.resolve([]),

  update: (id: number, data: Partial<NewTask>) =>
    db ? db.update(tasks).set(data).where(eq(tasks.id, id)).returning() : Promise.resolve([]),

  toggleDone: (id: number, done: boolean) =>
    db ? db.update(tasks).set({ done }).where(eq(tasks.id, id)).returning() : Promise.resolve([]),

  delete: (id: number) => db ? db.delete(tasks).where(eq(tasks.id, id)) : Promise.resolve([]),
};
