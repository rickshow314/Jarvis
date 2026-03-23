import { eq, and, lte } from 'drizzle-orm';
import { db } from '../client';
import { tasks, type Task, type NewTask } from '../schema';

export const taskRepo = {
  getAll: () => db.select().from(tasks).orderBy(tasks.createdAt),

  getByCategory: (category: Task['category']) =>
    db.select().from(tasks).where(eq(tasks.category, category)),

  getOverdue: () => {
    const now = new Date().toISOString();
    return db
      .select()
      .from(tasks)
      .where(and(eq(tasks.done, false), lte(tasks.dueDate, now)));
  },

  create: (data: NewTask) => db.insert(tasks).values(data).returning(),

  update: (id: number, data: Partial<NewTask>) =>
    db.update(tasks).set(data).where(eq(tasks.id, id)).returning(),

  toggleDone: (id: number, done: boolean) =>
    db.update(tasks).set({ done }).where(eq(tasks.id, id)).returning(),

  delete: (id: number) => db.delete(tasks).where(eq(tasks.id, id)),
};
