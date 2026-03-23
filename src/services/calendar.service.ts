import * as Calendar from 'expo-calendar';
import { eventRepo } from '../db/repositories/event.repo';
import type { NewEvent } from '../db/schema';

export const calendarService = {
  requestPermission: async (): Promise<boolean> => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  },

  getDefaultCalendarId: async (): Promise<string | null> => {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCal = calendars.find((c) => c.allowsModifications) ?? calendars[0];
    return defaultCal?.id ?? null;
  },

  createEvent: async (data: {
    title: string;
    startAt: string;
    endAt: string;
    location?: string;
  }): Promise<void> => {
    const calendarId = await calendarService.getDefaultCalendarId();
    let externalId: string | null = null;
    if (calendarId) {
      externalId = await Calendar.createEventAsync(calendarId, {
        title: data.title,
        startDate: new Date(data.startAt),
        endDate: new Date(data.endAt),
        location: data.location,
      });
    }

    const newEvent: NewEvent = {
      title: data.title,
      startAt: data.startAt,
      endAt: data.endAt,
      location: data.location,
      externalId,
      synced: externalId != null,
    };
    await eventRepo.create(newEvent);
  },

  detectConflicts: async (startAt: string, endAt: string): Promise<boolean> => {
    const events = await eventRepo.getAll();
    return events.some(
      (e) => e.startAt < endAt && e.endAt > startAt,
    );
  },
};
