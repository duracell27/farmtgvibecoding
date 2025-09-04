"use client";

import { useGameStore } from "@/store/gameStore";

export const Footer = () => {
  const { activeTab, setActiveTab, achievements } = useGameStore();

  // Count unclaimed achievements
  const getUnclaimedCount = () => {
    return achievements.reduce((count, achievement) => {
      return (
        count +
        achievement.levels.filter((level) => {
          const isCompleted = achievement.currentProgress >= level.requirement;
          const isClaimed = achievement.claimedLevels.includes(level.level);
          return isCompleted && !isClaimed;
        }).length
      );
    }, 0);
  };

  const unclaimedCount = getUnclaimedCount();

  return (
    <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
      <div className="max-w-sm mx-auto">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("farm")}
            className={`flex-1 py-4 pt-0 text-center transition-colors duration-200 ${
              activeTab === "farm"
                ? "bg-green-100 text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center space-y-1 pt-1">
              <span className="text-2xl">🌱</span>
              <span className="text-sm font-medium">Ферма</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("warehouse")}
            className={`flex-1 py-4 pt-0 text-center transition-colors duration-200 ${
              activeTab === "warehouse"
                ? "bg-green-100 text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center space-y-1 pt-1">
              <span className="text-2xl">📦</span>
              <span className="text-sm font-medium">Склад</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("achievements")}
            className={`flex-1 py-4 pt-0 text-center transition-colors duration-200 relative ${
              activeTab === "achievements"
                ? "bg-green-100 text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center space-y-1 pt-1">
              <div className="relative">
                <span className="text-2xl">🏆</span>
                {unclaimedCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unclaimedCount}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium">Досягнення</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("rating")}
            className={`flex-1 py-4 pt-0 text-center transition-colors duration-200 ${
              activeTab === "rating"
                ? "bg-green-100 text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center space-y-1 pt-1">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium">Рейтинг</span>
            </div>
          </button>
        </nav>
      </div>
    </footer>
  );
};
