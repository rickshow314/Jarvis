import { eq } from 'drizzle-orm';
import { db } from '../client';
import { events, type Event, type NewEvent } from '../schema';

export const eventRepo = {
  getAll: () => db ? db.select().from(events).orderBy(events.startAt) : Promise.resolve([]),

  getRange: (_from: string, _to: string) =>
    db ? db.select().from(events).where(eq(events.synced, events.synced)) : Promise.resolve([]),

  create: (data: NewEvent) => db ? db.insert(events).values(data).returning() : Promise.resolve([]),

  update: (id: number, data: Partial<NewEvent>) =>
    db ? db.update(events).set(data).where(eq(events.id, id)).returning() : Promise.resolve([]),

  delete: (id: number) => db ? db.delete(events).where(eq(events.id, id)) : Promise.resolve([]),
};
