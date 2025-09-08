'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';

export const useGameSync = () => {
  const { 
    user, 
    saveGameState, 
    loadGameState, 
    syncStatus, 
    lastSyncTime,
    initialSyncDone
  } = useGameStore();
  
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(false);
  const [isInitialSyncComplete, setIsInitialSyncComplete] = useState(false);
  const pathname = usePathname();

  // Debounced save function - only save if enough time has passed
  const debouncedSave = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTimeRef.current;
    
    // Only save if at least 5 seconds have passed since last save
    if (timeSinceLastSave >= 5000 && syncStatus === 'idle') {
      lastSaveTimeRef.current = now;
      await saveGameState();
    }
  }, [saveGameState, syncStatus]);

  // Load game state on mount (only once per app session)
  useEffect(() => {
    // For testing purposes, allow test user ID '1' to work
    const isTestMode = process.env.NODE_ENV === 'development';
    
    console.log('useGameSync: Loading game state', {
      userId: user.id,
      isTestMode,
      isInitialLoadRef: isInitialLoadRef.current
    });
    
    if (!isInitialLoadRef.current && !initialSyncDone && user.id && (user.id !== '1' || isTestMode)) {
      isInitialLoadRef.current = true;
      console.log('useGameSync: Starting loadGameState');
      loadGameState().then(() => {
        console.log('useGameSync: loadGameState completed successfully');
        setIsInitialSyncComplete(true);
      }).catch((error) => {
        console.error('useGameSync: loadGameState failed', error);
        setIsInitialSyncComplete(true); // Still mark as complete to avoid infinite loading
      });
    } else if (user.id === '1' && !isTestMode) {
      // For production with test user, mark as complete immediately
      console.log('useGameSync: Test user in production, marking as complete');
      setIsInitialSyncComplete(true);
    } else if (!user.id) {
      // No user ID, mark as complete
      console.log('useGameSync: No user ID, marking as complete');
      setIsInitialSyncComplete(true);
    } else if (initialSyncDone) {
      // Already synced earlier in session
      setIsInitialSyncComplete(true);
    }
  }, [user.id, loadGameState, initialSyncDone]);

  // Set up automatic sync every 30 seconds (only on main game page)
  useEffect(() => {
    // For testing purposes, allow test user ID '1' to work
    const isTestMode = process.env.NODE_ENV === 'development';
    
    if (pathname === '/' && user.id && (user.id !== '1' || isTestMode)) {
      // Clear any existing interval
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      // Set up new interval for 30 seconds
      syncIntervalRef.current = setInterval(() => {
        debouncedSave();
      }, 30000); // 30 seconds
    } else {
      // Clear interval if no valid user
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [pathname, user.id, debouncedSave]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user.id && user.id !== '1' && syncStatus === 'idle') {
        // Use sendBeacon for reliable save on page unload
        const gameState = useGameStore.getState();
        const data = JSON.stringify(gameState);
        
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/game/save', data);
        } else {
          // Fallback for browsers that don't support sendBeacon
          fetch('/api/game/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
            keepalive: true
          }).catch(console.error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user.id, syncStatus]);

  // Manual save function for immediate saves (e.g., on important actions)
  const manualSave = useCallback(async () => {
    const isTestMode = process.env.NODE_ENV === 'development';
    
    if (user.id && (user.id !== '1' || isTestMode) && syncStatus === 'idle') {
      lastSaveTimeRef.current = Date.now();
      await saveGameState();
    }
  }, [user.id, syncStatus, saveGameState]);

  const isTestMode = process.env.NODE_ENV === 'development';
  
  return {
    syncStatus,
    lastSyncTime,
    manualSave,
    isAutoSyncEnabled: user.id && (user.id !== '1' || isTestMode),
    isInitialSyncComplete,
  };
};
