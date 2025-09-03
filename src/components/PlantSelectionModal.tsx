'use client';

import Image from 'next/image';
import { useGameStore, PLANT_DATA } from '@/store/gameStore';
import { PlantType } from '@/types/game';

interface PlantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (plantType: PlantType) => void;
  selectedPlantType: PlantType | null;
}

export const PlantSelectionModal = ({ isOpen, onClose, onSelect, selectedPlantType }: PlantSelectionModalProps) => {
  const { user } = useGameStore();

  if (!isOpen) return null;

  const getAvailablePlants = () => {
    return Object.values(PLANT_DATA).filter(plant => 
      plant.requiredLevel <= user.level
    );
  };

  const getLockedPlants = () => {
    return Object.values(PLANT_DATA).filter(plant => 
      plant.requiredLevel > user.level
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">🌱 Виберіть рослину</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Available Plants */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Доступні рослини:</h3>
            <div className="space-y-3">
              {getAvailablePlants().map((plant) => (
                <button
                  key={plant.type}
                  onClick={() => {
                    onSelect(plant.type);
                    onClose();
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedPlantType === plant.type
                      ? 'border-green-500 bg-green-100 ring-2 ring-green-300'
                      : 'border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={plant.image}
                      alt={plant.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-lg text-gray-800">{plant.name}</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>💰 Ціна: {plant.buyPrice} монет</div>
                        <div>⏱️ Час росту: {plant.growTime} секунд</div>
                        <div>🎯 Досвід: {plant.experience} очок</div>
                        <div>💵 Продаж: {plant.sellPrice} монет</div>
                      </div>
                    </div>
                    <div className={`text-2xl ${
                      selectedPlantType === plant.type ? 'text-green-600' : 'text-green-400'
                    }`}>
                      {selectedPlantType === plant.type ? '✓' : '○'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Locked Plants */}
          {getLockedPlants().length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-600">Заблоковані рослини:</h3>
              <div className="space-y-3">
                {getLockedPlants().map((plant) => (
                  <div
                    key={plant.type}
                    className="w-full p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={plant.image}
                        alt={plant.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain grayscale"
                      />
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-lg text-gray-500">{plant.name}</div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <div>💰 Ціна: {plant.buyPrice} монет</div>
                          <div>⏱️ Час росту: {plant.growTime} секунд</div>
                          <div>🎯 Досвід: {plant.experience} очок</div>
                          <div>💵 Продаж: {plant.sellPrice} монет</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-center">
                        <div className="text-2xl">🔒</div>
                        <div className="text-xs">Рівень {plant.requiredLevel}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Порада:</strong> Виберіть рослину, а потім натисніть на вільну грядку для посадки!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
