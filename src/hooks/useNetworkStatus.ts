import { useEffect, useState } from 'react';
import { useChatStore } from '../store/chat.store';

// NetInfo is used lazily to avoid hard crash in Expo Go where native module may be absent
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const setOffline = useChatStore((s) => s.setOffline);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const NetInfo = require('@react-native-community/netinfo').default;
      unsub = NetInfo.addEventListener((state: { isConnected: boolean | null }) => {
        const connected = state.isConnected ?? true;
        setIsConnected(connected);
        setOffline(!connected);
      });
    } catch {
      // Native module not available (Expo Go) — assume connected
    }
    return () => unsub?.();
  }, [setOffline]);

  return isConnected;
}
