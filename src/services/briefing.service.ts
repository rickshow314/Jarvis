import { taskRepo } from '../db/repositories/task.repo';
import { eventRepo } from '../db/repositories/event.repo';

export interface BriefingSnapshot {
  date: string;
  topTasks: { title: string; priority: string; category: string }[];
  upcomingEvents: { title: string; startAt: string }[];
  weather: { description: string; temp: number } | null;
}

export const briefingService = {
  buildSnapshot: async (): Promise<BriefingSnapshot> => {
    const allTasks = await taskRepo.getAll();
    const allEvents = await eventRepo.getAll();
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const topTasks = allTasks
      .filter((t) => !t.done)
      .sort((a, b) => a.priority.localeCompare(b.priority))
      .slice(0, 3)
      .map((t) => ({ title: t.title, priority: t.priority, category: t.category }));

    const upcomingEvents = allEvents
      .filter((e) => e.startAt >= today && e.startAt < tomorrow + 'T23:59:59')
      .slice(0, 3)
      .map((e) => ({ title: e.title, startAt: e.startAt }));

    // Open-Meteo — free, no API key required
    let weather: BriefingSnapshot['weather'] = null;
    try {
      const resp = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&current=temperature_2m,weathercode&timezone=auto',
      );
      if (resp.ok) {
        const data = await resp.json();
        weather = {
          temp: Math.round(data.current.temperature_2m),
          description: codeToDescription(data.current.weathercode),
        };
      }
    } catch { /* offline — skip weather */ }

    return { date: today, topTasks, upcomingEvents, weather };
  },

  toText: (snapshot: BriefingSnapshot): string => {
    const parts: string[] = [`Good morning! Here's your briefing for ${snapshot.date}.`];
    if (snapshot.weather) {
      parts.push(`Weather: ${snapshot.weather.description}, ${snapshot.weather.temp}°C.`);
    }
    if (snapshot.topTasks.length) {
      parts.push(`Top tasks: ${snapshot.topTasks.map((t) => t.title).join(', ')}.`);
    } else {
      parts.push('No pending tasks — great job!');
    }
    if (snapshot.upcomingEvents.length) {
      parts.push(`Events today: ${snapshot.upcomingEvents.map((e) => e.title).join(', ')}.`);
    }
    return parts.join(' ');
  },
};

function codeToDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Showers';
  return 'Thunderstorm';
}
