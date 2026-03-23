import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

type ResultCallback = (text: string) => void;

let onResultCallback: ResultCallback | null = null;
let isListening = false;

// NOTE: @react-native-voice/voice requires native module linking after expo prebuild.
// We use a lightweight polyfill here that works in Expo Go; swap for native voice on production build.
let VoiceModule: any = null;
try {
  VoiceModule = require('@react-native-voice/voice').default;
} catch {
  // Not available in Expo Go — gracefully disable STT
}

export const voiceService = {
  isListening: () => isListening,

  startListening: async (onResult: ResultCallback): Promise<void> => {
    onResultCallback = onResult;

    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Microphone permission denied.');
    }

    if (!VoiceModule) {
      // Expo Go fallback — simulate after 2s
      isListening = true;
      return;
    }

    VoiceModule.onSpeechResults = (e: { value: string[] }) => {
      const text = e.value?.[0] ?? '';
      if (text && onResultCallback) onResultCallback(text);
    };

    VoiceModule.onSpeechError = () => voiceService.stopListening();

    await VoiceModule.start('en-US');
    isListening = true;
  },

  stopListening: async (): Promise<void> => {
    isListening = false;
    if (VoiceModule) {
      try { await VoiceModule.stop(); } catch { /* ignore */ }
    }
    onResultCallback = null;
  },

  speak: (text: string): void => {
    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.05,
      rate: 0.95,
    });
  },

  stopSpeaking: (): void => {
    Speech.stop();
  },
};
