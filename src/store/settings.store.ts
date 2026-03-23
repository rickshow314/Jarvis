import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  darkMode: boolean;
  briefingTime: string;  // 'HH:MM', e.g. '08:00'
  aiProvider: 'gemini';
  setDarkMode: (v: boolean) => void;
  setBriefingTime: (t: string) => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: false,
  briefingTime: '08:00',
  aiProvider: 'gemini',

  loadSettings: async () => {
    try {
      const [darkMode, briefingTime] = await Promise.all([
        AsyncStorage.getItem('darkMode'),
        AsyncStorage.getItem('briefingTime'),
      ]);
      set({
        darkMode: darkMode != null ? JSON.parse(darkMode) : false,
        briefingTime: briefingTime ?? '08:00',
      });
    } catch {}
  },

  setDarkMode: (v) => {
    AsyncStorage.setItem('darkMode', JSON.stringify(v));
    set({ darkMode: v });
  },

  setBriefingTime: (t) => {
    AsyncStorage.setItem('briefingTime', t);
    set({ briefingTime: t });
  },
}));
