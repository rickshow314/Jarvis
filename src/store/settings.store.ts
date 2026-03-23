import { create } from 'zustand';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'jarvis-settings' });

interface SettingsState {
  darkMode: boolean;
  briefingTime: string;  // 'HH:MM', e.g. '08:00'
  aiProvider: 'gemini';
  setDarkMode: (v: boolean) => void;
  setBriefingTime: (t: string) => void;
}

function persisted<T>(key: string, defaultValue: T): T {
  const raw = storage.getString(key);
  if (raw == null) return defaultValue;
  try { return JSON.parse(raw) as T; } catch { return defaultValue; }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  darkMode: persisted('darkMode', false),
  briefingTime: persisted('briefingTime', '08:00'),
  aiProvider: 'gemini',

  setDarkMode: (v) => {
    storage.set('darkMode', JSON.stringify(v));
    set({ darkMode: v });
  },

  setBriefingTime: (t) => {
    storage.set('briefingTime', JSON.stringify(t));
    set({ briefingTime: t });
  },
}));
