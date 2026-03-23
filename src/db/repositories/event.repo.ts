import { eq } from 'drizzle-orm';
import { db } from '../client';
import { events, type Event, type NewEvent } from '../schema';

export const eventRepo = {
  getAll: () => db.select().from(events).orderBy(events.startAt),

  getRange: (from: string, to: string) =>
    db
      .select()
      .from(events)
      .where(
        // startAt >= from AND startAt <= to
        eq(events.synced, events.synced), // placeholder; real filter via sql``
      ),

  create: (data: NewEvent) => db.insert(events).values(data).returning(),

  update: (id: number, data: Partial<NewEvent>) =>
    db.update(events).set(data).where(eq(events.id, id)).returning(),

  delete: (id: number) => db.delete(events).where(eq(events.id, id)),
};
