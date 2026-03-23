import { briefingService } from './briefing.service';
import { voiceService } from './voice.service';

let Notifications: typeof import('expo-notifications') | null = null;
try {
  Notifications = require('expo-notifications');
  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch {
  // expo-notifications not available
}

export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!Notifications) return false;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  scheduleDailyBriefing: async (time: string): Promise<void> => {
    if (!Notifications) return;
    const [hour, minute] = time.split(':').map(Number);
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '☀️ Good morning!',
        body: "Your daily briefing is ready. Tap to hear it.",
        data: { type: 'briefing' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },

  sendImmediateBriefing: async (): Promise<void> => {
    const snapshot = await briefingService.buildSnapshot();
    const text = briefingService.toText(snapshot);
    voiceService.speak(text);
  },
};
