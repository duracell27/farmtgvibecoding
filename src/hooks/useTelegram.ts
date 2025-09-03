'use client';

import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getApiUrl } from '@/lib/api';

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
  const validationAttempted = useRef(false);
  const lastValidationTime = useRef(0);

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

    const initializeTelegram = async () => {
      try {
        console.log('useTelegram: Attempting to initialize Telegram WebApp');
        
        // Check if we're in Telegram WebApp environment
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          
          // Initialize Telegram WebApp
          tg.ready();
          tg.expand();
          
          // Get init data for validation
          const initData = tg.initData;
          
          if (initData && !validationAttempted.current) {
            const now = Date.now();
            const timeSinceLastValidation = now - lastValidationTime.current;
            
            // Only validate once per session or if more than 5 minutes have passed
            if (timeSinceLastValidation > 5 * 60 * 1000) {
              console.log('useTelegram: Validating init data');
              validationAttempted.current = true;
              lastValidationTime.current = now;
              
              try {
                // Validate with our API
                const response = await fetch(getApiUrl('/api/telegram/validate'), {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ initData }),
                });
              
              if (response.ok) {
                const result = await response.json();
                if (result.valid && result.user) {
                  console.log('useTelegram: User data validated:', result.user);
                  
                  // Get current state to preserve game progress
                  const currentState = useGameStore.getState();
                  
                  // Update user data in store while preserving game progress
                  useGameStore.setState({
                    user: {
                      ...currentState.user,
                      id: result.user.id.toString(),
                      firstName: result.user.first_name,
                      lastName: result.user.last_name || '',
                      username: result.user.username || '',
                      avatarUrl: result.user.photo_url || '',
                      // Preserve game progress (level, experience, coins)
                      level: currentState.user.level,
                      experience: currentState.user.experience,
                      experienceToNextLevel: currentState.user.experienceToNextLevel,
                      coins: currentState.user.coins,
                    },
                  });
                  
                  console.log('useTelegram: User data updated, game progress preserved');
                }
              } else {
                console.warn('useTelegram: Validation failed');
              }
              } catch (apiError) {
                console.warn('useTelegram: API validation failed, using unsafe data:', apiError);
                
                // Fallback to unsafe data
                const tgUser = tg.initDataUnsafe?.user as TelegramUser;
                if (tgUser) {
                  console.log('useTelegram: Using unsafe user data:', tgUser);
                  
                  // Get current state to preserve game progress
                  const currentState = useGameStore.getState();
                  
                  useGameStore.setState({
                    user: {
                      ...currentState.user,
                      id: tgUser.id.toString(),
                      firstName: tgUser.first_name,
                      lastName: tgUser.last_name || '',
                      username: tgUser.username || '',
                      avatarUrl: tgUser.photo_url || '',
                      // Preserve game progress (level, experience, coins)
                      level: currentState.user.level,
                      experience: currentState.user.experience,
                      experienceToNextLevel: currentState.user.experienceToNextLevel,
                      coins: currentState.user.coins,
                    },
                  });
                }
              }
            } else {
              console.log('useTelegram: Validation skipped - already attempted recently');
            }
          } else if (initData) {
            console.log('useTelegram: Validation already attempted in this session');
          } else {
            console.log('useTelegram: No init data available');
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
        initData?: string;
        initDataUnsafe?: {
          user?: TelegramUser;
        };
      };
    };
  }
}
