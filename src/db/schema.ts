import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';

// ── Tasks ────────────────────────────────────────────────────────────────────
export const tasks = sqliteTable('tasks', {
  id: int('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  category: text('category', { enum: ['work', 'personal', 'health', 'errands'] })
    .notNull()
    .default('personal'),
  priority: text('priority', { enum: ['P1', 'P2', 'P3'] }).notNull().default('P2'),
  dueDate: text('due_date'),        // ISO-8601 string
  recurrence: text('recurrence'),   // 'daily' | 'weekly' | null
  done: int('done', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ','now'))"),
});

// ── Events ───────────────────────────────────────────────────────────────────
export const events = sqliteTable('events', {
  id: int('id').primaryKey({ autoIncrement: true }),
  externalId: text('external_id'),  // native calendar event id
  title: text('title').notNull(),
  startAt: text('start_at').notNull(),
  endAt: text('end_at').notNull(),
  location: text('location'),
  synced: int('synced', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ','now'))"),
});

// ── Conversations & Messages ──────────────────────────────────────────────────
export const conversations = sqliteTable('conversations', {
  id: int('id').primaryKey({ autoIncrement: true }),
  createdAt: text('created_at').notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ','now'))"),
});

export const messages = sqliteTable('messages', {
  id: int('id').primaryKey({ autoIncrement: true }),
  conversationId: int('conversation_id').notNull(),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default("(strftime('%Y-%m-%dT%H:%M:%SZ','now'))"),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
