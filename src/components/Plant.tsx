'use client';

import { useGameStore } from '@/store/gameStore';

export const Plant = () => {
  const { currentPlant, clickPlant } = useGameStore();

  if (!currentPlant) {
    return null;
  }

  const handleClick = () => {
    clickPlant();
  };

  const getPlantEmoji = () => {
    if (currentPlant.isReady) {
      return '🧅'; // Ready onion
    }
    return '🌱'; // Growing plant
  };

  const getTimerColor = () => {
    if (currentPlant.timeLeft <= 5) {
      return 'text-red-500';
    } else if (currentPlant.timeLeft <= 15) {
      return 'text-yellow-500';
    }
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      {/* Timer */}
      <div className={`text-4xl font-bold mb-4 ${getTimerColor()}`}>
        {currentPlant.timeLeft}
      </div>
      
      {/* Plant */}
      <button
        onClick={handleClick}
        className="text-8xl hover:scale-110 transition-transform duration-200 active:scale-95"
        disabled={currentPlant.isReady}
      >
        {getPlantEmoji()}
      </button>
      
      {/* Status text */}
      <div className="mt-4 text-lg text-gray-600">
        {currentPlant.isReady ? (
          <span className="text-green-600 font-semibold">Готово до збору!</span>
        ) : (
          <span>Клікніть для прискорення</span>
        )}
      </div>
    </div>
  );
};
