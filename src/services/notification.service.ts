import * as Notifications from 'expo-notifications';
import { briefingService } from './briefing.service';
import { voiceService } from './voice.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  scheduleDailyBriefing: async (time: string): Promise<void> => {
    const [hour, minute] = time.split(':').map(Number);
    // Cancel any existing briefing triggers
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
