"use client";

import { useGameStore } from "@/store/gameStore";
import { RatingType } from "@/types/game";
import { useEffect } from "react";
import Image from "next/image";

export const Rating = () => {
  const { 
    ratingData, 
    activeRatingType, 
    loadRatingData, 
    setActiveRatingType,
    syncStatus,
    activeTab
  } = useGameStore();

  useEffect(() => {
    // Only load rating data when user switches to rating tab for the first time
    if (activeTab === 'rating' && !ratingData) {
      loadRatingData(activeRatingType);
    }
  }, [activeTab, activeRatingType, loadRatingData, ratingData]);

  const handleRatingTypeChange = (type: RatingType) => {
    setActiveRatingType(type);
    // Load data for the new type
    loadRatingData(type);
  };

  const getRatingTypeLabel = (type: RatingType) => {
    switch (type) {
      case 'level':
        return 'За лвл';
      case 'harvests':
        return 'За урожаями';
      case 'clicks':
        return 'За кліками';
    }
  };

  const getValueLabel = (type: RatingType, value: number) => {
    switch (type) {
      case 'level':
        return `Лвл ${value}`;
      case 'harvests':
        return `${value} урожаїв`;
      case 'clicks':
        return `${value.toLocaleString()} кліків`;
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🏆 Рейтинг гравців
          </h2>
          <button
            onClick={() => loadRatingData(activeRatingType)}
            disabled={syncStatus === 'loading'}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <span>{syncStatus === 'loading' ? '⏳' : '🔄'}</span>
            <span>{syncStatus === 'loading' ? 'Оновлення...' : 'Оновити'}</span>
          </button>
        </div>

        {/* Rating type tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {(['level', 'harvests', 'clicks'] as RatingType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleRatingTypeChange(type)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeRatingType === type
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {getRatingTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {syncStatus === 'loading' && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Завантаження рейтингу...</p>
          </div>
        )}

        {/* Error state */}
        {syncStatus === 'error' && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Помилка завантаження рейтингу</p>
            <button
              onClick={() => loadRatingData(activeRatingType)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Спробувати знову
            </button>
          </div>
        )}

        {/* Rating list */}
        {ratingData && ratingData.type === activeRatingType && syncStatus === 'idle' && (
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600 mb-4">
              Всього гравців: {ratingData.totalUsers}
            </div>
            
            {ratingData.entries.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p>Поки що немає даних для цього рейтингу</p>
              </div>
            ) : (
              ratingData.entries.map((entry) => (
                <div
                  key={entry.user.id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-4"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <span className="text-2xl">
                      {getMedalEmoji(entry.rank)}
                    </span>
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {entry.user.avatarUrl ? (
                          <Image
                            src={entry.user.avatarUrl}
                            alt={entry.user.firstName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-lg">
                              {entry.user.firstName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Name */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {entry.user.firstName} {entry.user.lastName || ''}
                        </p>
                        {entry.user.username && (
                          <p className="text-xs text-gray-500 truncate">
                            @{entry.user.username}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Value */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {getValueLabel(activeRatingType, entry.value)}
                    </p>
                    {activeRatingType === 'level' && (
                      <p className="text-xs text-gray-500">
                        {entry.user.experience} оп
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
