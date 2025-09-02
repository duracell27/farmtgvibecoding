'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export const useTelegram = () => {
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useGameStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const initializeTelegram = () => {
      // Check if we're in Telegram WebApp environment
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Initialize Telegram WebApp
        tg.ready();
        tg.expand();
        
        // Get user data from Telegram
        const tgUser = tg.initDataUnsafe?.user as TelegramUser;
        
        if (tgUser) {
          // Update user data in store
          useGameStore.setState({
            user: {
              ...user,
              id: tgUser.id.toString(),
              firstName: tgUser.first_name,
              lastName: tgUser.last_name || '',
              username: tgUser.username || '',
              avatarUrl: tgUser.photo_url || '',
            },
          });
        }
        
        setIsReady(true);
      } else {
        // For development/testing outside Telegram
        setIsReady(true);
      }
    };

    // Wait for Telegram script to load
    if (window.Telegram?.WebApp) {
      initializeTelegram();
    } else {
      // Wait for script to load
      const checkTelegram = setInterval(() => {
        if (window.Telegram?.WebApp) {
          clearInterval(checkTelegram);
          initializeTelegram();
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(checkTelegram);
        setIsReady(true);
      }, 5000);
    }
  }, [isMounted, user]);

  return {
    isReady,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe?: {
          user?: TelegramUser;
        };
      };
    };
  }
}
