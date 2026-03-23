import type { Task } from '../db/schema';
import type { Event } from '../db/schema';

export function buildSystemPrompt(tasks: Task[], upcomingEvents: Event[]): string {
  const taskList = tasks
    .filter((t) => !t.done)
    .slice(0, 10)
    .map((t) => `- [${t.priority}] ${t.title} (${t.category})${t.dueDate ? ` due ${t.dueDate}` : ''}`)
    .join('\n');

  const eventList = upcomingEvents
    .slice(0, 5)
    .map((e) => `- ${e.title} at ${e.startAt}`)
    .join('\n');

  return `You are Jarvis, a smart personal AI assistant on the user's phone. Be concise, friendly, and proactive.

Today's date: ${new Date().toISOString().slice(0, 10)}

Current tasks (pending):
${taskList || 'None'}

Upcoming events:
${eventList || 'None'}

When the user asks to create a task, respond in this exact JSON format on the FIRST line (before any text):
ACTION:{"action":"create_task","title":"...","category":"work|personal|health|errands","priority":"P1|P2|P3","dueDate":"YYYY-MM-DD or null"}

When the user asks to schedule an event, respond with:
ACTION:{"action":"schedule_event","title":"...","startAt":"ISO-8601","endAt":"ISO-8601"}

For all other requests, respond naturally as a helpful assistant.`;
}
