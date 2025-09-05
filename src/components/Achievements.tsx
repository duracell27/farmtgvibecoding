'use client';

import { useGameStore } from '@/store/gameStore';
import { AchievementType } from '@/types/game';
import { useEffect } from 'react';

export const Achievements = () => {
  const { achievements, claimAchievementReward, updateAchievements } = useGameStore();

  // Update achievements when component mounts
  useEffect(() => {
    updateAchievements();
  }, [updateAchievements]);

  const handleClaimReward = (achievementType: AchievementType, level: number) => {
    claimAchievementReward(achievementType, level);
  };

  const getProgressPercentage = (achievement: typeof achievements[0]) => {
      if (achievement.currentLevel === 0) {
    const nextLevel = achievement.levels[0];
    const currentProgress = achievement.currentProgress || 0;
    return Math.min(100, (currentProgress / nextLevel.requirement) * 100);
  }
    
    if (achievement.currentLevel >= 7) {
      return 100;
    }
    
    const currentLevelData = achievement.levels.find((l) => l.level === achievement.currentLevel);
    const nextLevelData = achievement.levels.find((l) => l.level === achievement.currentLevel + 1);
    
    if (!currentLevelData || !nextLevelData) return 100;
    
    const currentProgress = achievement.currentProgress || 0;
    const progressInCurrentLevel = currentProgress - currentLevelData.requirement;
    const requiredForNext = nextLevelData.requirement - currentLevelData.requirement;
    
    return Math.min(100, (progressInCurrentLevel / requiredForNext) * 100);
  };

  const getNextLevelRequirement = (achievement: typeof achievements[0]) => {
    if (achievement.currentLevel >= 7) return null;
    
    const nextLevel = achievement.levels.find((l) => l.level === achievement.currentLevel + 1);
    return nextLevel;
  };

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold text-center mb-4 text-green-600">🏆 Досягнення</h2>
      
      <div className="space-y-4">
        {achievements.map((achievement) => {
          const nextLevel = getNextLevelRequirement(achievement);
          const progressPercentage = getProgressPercentage(achievement);
          
          // Get visible levels: completed + next one
          const visibleLevels = achievement.levels.filter(level => {
            const currentProgress = achievement.currentProgress || 0;
            const isCompleted = currentProgress >= level.requirement;
            const isNext = level.level === achievement.currentLevel + 1;
            return isCompleted || isNext;
          });
          
          return (
            <div key={achievement.type} className="bg-white rounded-lg shadow-md p-3 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{achievement.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">{achievement.name}</h3>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">Рівень {achievement.currentLevel}/7</div>
                  <div className="text-xs text-gray-500">{(achievement.currentProgress || 0).toLocaleString()}</div>
                </div>
              </div>
              
              {/* Compact Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                {nextLevel && (
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    До наступного: {nextLevel.requirement.toLocaleString()}
                  </div>
                )}
              </div>
              
              {/* Compact Achievement Levels */}
              <div className="space-y-1">
                {visibleLevels.map((level) => {
                  const currentProgress = achievement.currentProgress || 0;
                  const isCompleted = currentProgress >= level.requirement;
                  const isClaimed = achievement.claimedLevels.includes(level.level);
                  const canClaim = isCompleted && !isClaimed;
                  
                  return (
                    <div 
                      key={level.level}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`text-sm mr-2 ${
                          isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {isCompleted ? '✅' : '⭕'}
                        </span>
                        <div>
                          <span className={`font-medium ${
                            level.level === achievement.currentLevel ? 'text-green-700 font-bold' : 'text-gray-700'
                          }`}>
                            Рівень {level.level}: {level.description}
                          </span>
                          <div className="text-xs text-gray-500">
                            {level.reward.toLocaleString()} 💰
                          </div>
                        </div>
                      </div>
                      
                      {canClaim ? (
                        <button
                          onClick={() => handleClaimReward(achievement.type, level.level)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium hover:bg-green-600 transition-colors"
                        >
                          Отримати
                        </button>
                      ) : isClaimed ? (
                        <span className="text-green-600 text-xs font-medium">✅</span>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          {level.requirement.toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
