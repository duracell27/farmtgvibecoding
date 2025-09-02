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

  // Force ready after 3 seconds maximum
  useEffect(() => {
    const forceReady = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(forceReady);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    console.log('useTelegram: Starting initialization');

    const initializeTelegram = () => {
      try {
        console.log('useTelegram: Attempting to initialize Telegram WebApp');
        
        // Check if we're in Telegram WebApp environment
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          
          // Initialize Telegram WebApp
          tg.ready();
          tg.expand();
          
          // Get user data from Telegram
          const tgUser = tg.initDataUnsafe?.user as TelegramUser;
          
          if (tgUser) {
            console.log('useTelegram: User data found:', tgUser);
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
          } else {
            console.log('useTelegram: No user data found');
          }
        } else {
          console.log('useTelegram: Telegram WebApp not available');
        }
      } catch (error) {
        console.warn('useTelegram: Initialization failed:', error);
      }
    };

    // Always set ready to true after a short delay
    // This prevents infinite loading screen
    const timer = setTimeout(() => {
      console.log('useTelegram: Setting ready to true after timeout');
      setIsReady(true);
    }, 1000);

    // Try to initialize Telegram if available
    if (typeof window !== 'undefined') {
      if (window.Telegram?.WebApp) {
        console.log('useTelegram: Telegram WebApp available immediately');
        initializeTelegram();
      } else {
        console.log('useTelegram: Waiting for Telegram WebApp to load');
        // Wait for script to load
        const checkTelegram = setInterval(() => {
          if (window.Telegram?.WebApp) {
            console.log('useTelegram: Telegram WebApp loaded');
            clearInterval(checkTelegram);
            initializeTelegram();
          }
        }, 100);

        // Clear interval after 2 seconds
        setTimeout(() => {
          console.log('useTelegram: Stopping Telegram check');
          clearInterval(checkTelegram);
        }, 2000);
      }
    }

    return () => {
      clearTimeout(timer);
    };
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
