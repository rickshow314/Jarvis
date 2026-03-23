import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;
try {
  const sqlite = SQLite.openDatabaseSync('jarvis.db');
  db = drizzle(sqlite, { schema });
} catch (e) {
  console.warn('expo-sqlite not available:', e);
}
export { db };
