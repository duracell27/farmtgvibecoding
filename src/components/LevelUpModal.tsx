'use client';

import Image from 'next/image';
import { PLANT_DATA } from '@/store/gameStore';
import { PlantType } from '@/types/game';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  newPlantType: PlantType | null;
  rewardCoins: number;
}

export const LevelUpModal = ({ isOpen, onClose, newLevel, newPlantType, rewardCoins }: LevelUpModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const newPlantData = newPlantType ? PLANT_DATA[newPlantType] : null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-2xl max-w-md w-full border-4 border-yellow-400">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 text-center rounded-t-xl">
          <div className="text-6xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold">Вітаємо!</h2>
          <p className="text-lg opacity-90">Ви досягли {newLevel} рівня!</p>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Reward Coins */}
          <div className="mb-6">
            <div className="bg-yellow-100 rounded-xl p-4 border-2 border-yellow-300">
              <div className="text-2xl font-bold text-yellow-800 flex items-center justify-center space-x-2">
                <span>+{rewardCoins}</span>
                <Image src="/images/монета.png" alt="Монети" width={28} height={28} className="w-7 h-7 object-contain" />
              </div>
              <div className="text-sm text-yellow-600 mt-1">
                Нагорода за досягнення рівня!
              </div>
            </div>
          </div>

          {/* New Plant Unlocked */}
          {newPlantData && (
            <div className="mb-6">
              <div className="bg-green-100 rounded-xl p-4 border-2 border-green-300">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-lg font-semibold text-green-800 mb-2">
                  Нова рослина розблокована!
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
                    <Image
                      src={newPlantData.image}
                      alt={newPlantData.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                      style={{ transform: 'scale(1.45)', transformOrigin: 'center' }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-green-800 text-lg">
                      {newPlantData.name}
                    </div>
                    <div className="text-sm text-green-600">
                      Рівень {newPlantData.requiredLevel}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-green-700 space-y-1">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Ціна: {newPlantData.buyPrice}</span>
                    <Image src="/images/монета.png" alt="Монети" width={16} height={16} className="w-4 h-4 object-contain" />
                  </div>
                  <div className="flex justify-start items-center space-x-1">Час росту: {newPlantData.growTime} сек ⏱️</div>
                  <div className="flex justify-start items-center space-x-1">
                    <span>Продаж: {newPlantData.sellPrice}</span>
                    <Image src="/images/монета.png" alt="Монети" width={16} height={16} className="w-4 h-4 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
