import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useTimer = () => {
  const { isGameRunning, decrementTimer } = useGameStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGameRunning) {
      intervalRef.current = setInterval(() => {
        decrementTimer();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGameRunning, decrementTimer]);

  return {
    isGameRunning,
  };
};
