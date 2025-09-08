'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import { useGameSync } from '@/hooks/useGameSync';
import { HelpModal } from './HelpModal';

export const Header = () => {
  const { user, forceStateUpdate } = useGameStore();
  const { syncStatus, lastSyncTime, isAutoSyncEnabled } = useGameSync();
  const { setLastSyncNow } = useGameStore();
  const [, setCurrentTime] = useState(Date.now());
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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
      {/* Help button - centered at the top */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors backdrop-blur-sm"
        >
           Як грати ❓ 
        </button>
      </div>

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
              <h1 className="text-lg font-bold leading-4">
                {user.firstName} {user.lastName && user.lastName.trim()}
              </h1>
              {user.username && (
                <p className="text-sm text-green-100">@{user.username}</p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1">
              <div className="flex items-center whitespace-nowrap bg-green-500 rounded-full pl-2 pr-1">
                <span className="text-lg font-bold">{user.coins}</span>
                <Image src="/images/монета.png" alt="Монети" width={24} height={24} className="w-6 h-6 object-contain" />
              </div>
              <div className="flex items-center whitespace-nowrap bg-green-500 rounded-full pl-2 pr-1">
                <span className="text-lg font-bold">{user.emeralds}</span>
                <Image src="/images/смарагд.png" alt="Смарагд" width={24} height={24} className="w-6 h-6 object-contain" />
              </div>
            </div>
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
                {!lastSyncTime && syncStatus === 'idle' && (
                  <button onClick={setLastSyncNow} className="text-xs text-green-200 underline">Позначити синхронізовано</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Level and experience */}
        <div className="space-y-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Рівень {user.level}</span>
            <span className="text-sm text-green-100 inline-flex items-center space-x-1">
              <span>
                {user.experience % user.experienceToNextLevel} / {user.experienceToNextLevel}
              </span>
              <Image src="/images/досвід.png" alt="Досвід" width={20} height={20} className="w-6 h-6 object-contain" />
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-green-800 rounded-full h-2 relative">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            {/* Progress percentage badge */}
            <div className="bg-yellow-400 text-green-800 text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
              {Math.round(getProgressPercentage())}%
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setIsHelpModalOpen(false)} 
      />
    </header>
  );
};
