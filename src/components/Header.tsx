'use client';

import Image from 'next/image';
import { useGameStore } from '@/store/gameStore';

export const Header = () => {
  const { user } = useGameStore();

  const getProgressPercentage = () => {
    const currentLevelExp = user.experience % user.experienceToNextLevel;
    return (currentLevelExp / user.experienceToNextLevel) * 100;
  };

  return (
    <header className="bg-green-600 text-white p-4 shadow-lg pt-16">
      <div className="max-w-md mx-auto">
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
