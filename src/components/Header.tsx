'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import { useGameSync } from '@/hooks/useGameSync';

export const Header = () => {
  const { user, forceStateUpdate } = useGameStore();
  const { syncStatus, lastSyncTime, isAutoSyncEnabled } = useGameSync();
  const [, setCurrentTime] = useState(Date.now());

  // Force state update when component mounts to ensure data is fresh
  useEffect(() => {
    forceStateUpdate();
  }, [forceStateUpdate]);

  // Update time every minute to keep sync time display current
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getProgressPercentage = () => {
    const currentLevelExp = user.experience % user.experienceToNextLevel;
    return (currentLevelExp / user.experienceToNextLevel) * 100;
  };

  const formatLastSyncTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'щойно';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} хв тому`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} год тому`;
    }
    
    // More than 1 day
    const days = Math.floor(diff / 86400000);
    return `${days} дн тому`;
  };

  const getNextSyncTime = () => {
    if (!lastSyncTime) return null;
    
    const now = Date.now();
    const timeSinceLastSync = now - lastSyncTime;
    const syncInterval = 30000; // 30 seconds
    const timeUntilNextSync = syncInterval - (timeSinceLastSync % syncInterval);
    
    return Math.ceil(timeUntilNextSync / 1000); // Return seconds
  };

  return (
    <header className="bg-green-600 text-white p-4 shadow-lg pt-24 relative z-50">
      <div className="max-w-sm mx-auto">
        {/* User info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-2xl">👤</span>';
                    }
                  }}
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            
            {/* User name */}
            <div>
              <h1 className="text-lg font-bold">
                {user.firstName} {user.lastName && user.lastName.trim()}
              </h1>
              {user.username && (
                <p className="text-sm text-green-100">@{user.username}</p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold">💰 {user.coins}</div>
            {/* Sync status indicator */}
            {isAutoSyncEnabled && (
              <div className="flex items-center justify-end mt-1">
                {syncStatus === 'saving' && (
                  <div className="flex items-center text-xs text-green-200">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
                    Збереження...
                  </div>
                )}
                {syncStatus === 'loading' && (
                  <div className="flex items-center text-xs text-green-200">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
                    Завантаження...
                  </div>
                )}
                {syncStatus === 'error' && (
                  <div className="text-xs text-red-200">⚠️ Помилка синхронізації</div>
                )}
                {syncStatus === 'idle' && lastSyncTime && (
                  <div className="text-xs text-green-200">
                    ✅ {formatLastSyncTime(lastSyncTime)}
                    {(() => {
                      const nextSyncSeconds = getNextSyncTime();
                      return nextSyncSeconds !== null ? ` (${nextSyncSeconds}с)` : '';
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Level and experience */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Рівень {user.level}</span>
            <span className="text-sm text-green-100">
              {user.experience % user.experienceToNextLevel} / {user.experienceToNextLevel} досвіду
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-green-800 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
