'use client';

import Image from 'next/image';
import { useGameStore, FERTILIZER_DATA } from '@/store/gameStore';
import { FertilizerType } from '@/types/game';

interface FertilizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (fertilizerType: FertilizerType) => void;
  selectedFertilizerType: FertilizerType | null;
}

export const FertilizerModal = ({ isOpen, onClose, onSelect, selectedFertilizerType }: FertilizerModalProps) => {
  const { user } = useGameStore();

  if (!isOpen) return null;

  const getAvailableFertilizers = () => {
    return Object.values(FERTILIZER_DATA).filter(fertilizer => 
      fertilizer.requiredLevel <= user.level
    );
  };

  const getLockedFertilizers = () => {
    return Object.values(FERTILIZER_DATA).filter(fertilizer => 
      fertilizer.requiredLevel > user.level
    );
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatTimeReduction = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} хв`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} год`;
      } else {
        return `${hours} год ${remainingMinutes} хв`;
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-orange-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">🌱 Добрива</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {/* Available Fertilizers */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Доступні добрива:</h3>
            <div className="space-y-3">
              {getAvailableFertilizers().map((fertilizer) => (
                <button
                  key={fertilizer.type}
                  onClick={() => {
                    onSelect(fertilizer.type);
                    onClose();
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedFertilizerType === fertilizer.type
                      ? 'border-orange-500 bg-orange-100 ring-2 ring-orange-300'
                      : 'border-orange-200 bg-orange-50 hover:border-orange-400 hover:bg-orange-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={fertilizer.image}
                      alt={fertilizer.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-lg text-gray-800">{fertilizer.name}</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>💰 Ціна: {fertilizer.price} монет</div>
                        <div>⚡ Скорочення: {formatTimeReduction(fertilizer.timeReduction)}</div>
                        <div>🎯 Досвід: {fertilizer.experience} очок</div>
                        <div className="text-xs text-gray-500 italic">{fertilizer.description}</div>
                      </div>
                    </div>
                    <div className={`text-2xl ${
                      selectedFertilizerType === fertilizer.type ? 'text-orange-600' : 'text-orange-400'
                    }`}>
                      {selectedFertilizerType === fertilizer.type ? '✓' : '○'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Locked Fertilizers */}
          {getLockedFertilizers().length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-600">Заблоковані добрива:</h3>
              <div className="space-y-3">
                {getLockedFertilizers().map((fertilizer) => (
                  <div
                    key={fertilizer.type}
                    className="w-full p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={fertilizer.image}
                        alt={fertilizer.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain grayscale"
                      />
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-lg text-gray-500">{fertilizer.name}</div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <div>💰 Ціна: {fertilizer.price} монет</div>
                          <div>⚡ Скорочення: {formatTimeReduction(fertilizer.timeReduction)}</div>
                          <div>🎯 Досвід: {fertilizer.experience} очок</div>
                          <div className="text-xs text-gray-400 italic">{fertilizer.description}</div>
                        </div>
                      </div>
                      <div className="text-gray-400 text-center">
                        <div className="text-2xl">🔒</div>
                        <div className="text-xs">Рівень {fertilizer.requiredLevel}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>💡 Порада:</strong> Виберіть добриво, а потім натисніть на рослину для застосування!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
