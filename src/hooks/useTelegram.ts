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


    const initializeTelegram = async () => {
      try {
        
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
                  
                }
              } else {
                console.warn('useTelegram: Validation failed');
              }
              } catch (apiError) {
                console.warn('useTelegram: API validation failed, using unsafe data:', apiError);
                
                // Fallback to unsafe data
                const tgUser = tg.initDataUnsafe?.user as TelegramUser;
                if (tgUser) {
                  
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
            }
          } else if (initData) {
          } else {
          }
        } else {
        }
      } catch (error) {
        console.warn('useTelegram: Initialization failed:', error);
      }
    };

    // Always set ready to true after a short delay
    // This prevents infinite loading screen
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    // Try to initialize Telegram if available
    if (typeof window !== 'undefined') {
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

        // Clear interval after 2 seconds
        setTimeout(() => {
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
