'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useGameStore, PLANT_DATA } from '@/store/gameStore';
import { PlantType } from '@/types/game';
import { PlantSelectionModal } from './PlantSelectionModal';

export const Farm = () => {
  const { 
    farmPlots, 
    user, 
    selectedPlantType, 
    clickPlant, 
    plantSeed, 
    unlockPlot, 
    selectPlantType,
    isHarvesting 
  } = useGameStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlotClick = (plotId: string) => {
    const plot = farmPlots.find(p => p.id === plotId);
    
    console.log('handlePlotClick:', {
      plotId,
      plot: plot ? { id: plot.id, isUnlocked: plot.isUnlocked, hasPlant: !!plot.plant } : null,
      selectedPlantType,
      userCoins: user.coins
    });
    
    if (!plot) return;
    
    if (!plot.isUnlocked) {
      // Try to unlock the plot
      console.log('Trying to unlock plot:', plotId);
      unlockPlot(plotId);
      return;
    }
    
    if (plot.plant) {
      // Click on existing plant
      console.log('Clicking on existing plant:', plotId);
      clickPlant(plotId);
    } else if (selectedPlantType) {
      // Plant selected seed
      console.log('Planting seed:', { plotId, plantType: selectedPlantType });
      plantSeed(plotId, selectedPlantType);
    } else {
      console.log('No plant selected for planting');
    }
  };

  const handlePlantSelect = (plantType: PlantType) => {
    selectPlantType(plantType);
  };

  return (
    <div className="p-4">
      {/* Plant Selection Button */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Ферма</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
          >
            {selectedPlantType ? (
              <>
                <Image
                  src={PLANT_DATA[selectedPlantType].image}
                  alt={PLANT_DATA[selectedPlantType].name}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
                <span>{PLANT_DATA[selectedPlantType].name}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    selectPlantType(null);
                  }}
                  className="text-green-200 hover:text-white ml-1 cursor-pointer"
                >
                  ✕
                </span>
              </>
            ) : (
              <>
                <span>🌱</span>
                <span>Виберіть рослину</span>
              </>
            )}
          </button>
        </div>


      </div>

      {/* Farm Plots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Грядки: {farmPlots.filter(p => p.isUnlocked).length}/{farmPlots.length}
          </h3>
          {(() => {
            const lockedPlots = farmPlots.filter(p => !p.isUnlocked);
            const nextPlot = lockedPlots[0]; // First locked plot
            
            console.log('Debug - lockedPlots:', lockedPlots);
            console.log('Debug - nextPlot:', nextPlot);
            
            if (nextPlot) {
              return (
                <div className="text-sm text-gray-600">
                  Наступна: 💰 {nextPlot.unlockPrice}
                </div>
              );
            }
            return (
              <div className="text-sm text-green-600">
                Всі 7 грядок розблоковані! 🎉
              </div>
            );
          })()}
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Загальна кількість грядок: {farmPlots.length} | 
          Розблоковано: {farmPlots.filter(p => p.isUnlocked).length} | 
          Заблоковано: {farmPlots.filter(p => !p.isUnlocked).length}
        </div>
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-2">
          {farmPlots
            .filter((plot) => {
              // Show unlocked plots and the next locked plot
              if (plot.isUnlocked) return true;
              
              // Find the first locked plot (next available for purchase)
              const lockedPlots = farmPlots.filter(p => !p.isUnlocked);
              const firstLockedPlot = lockedPlots[0];
              
              return plot.id === firstLockedPlot?.id;
            })
            .map((plot, index) => (
            <div
              key={plot.id}
              className="relative"
            >
              {/* Plot number for debugging */}
              <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded z-10">
                {index + 1}
              </div>
              {/* Plot status for debugging */}
              <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded z-10">
                {plot.isUnlocked ? '✓' : '🔒'}
              </div>
              <button
                onClick={() => handlePlotClick(plot.id)}
                className={`w-full h-32 rounded-lg border-2 transition-all relative overflow-hidden ${
                  plot.isUnlocked
                    ? 'border-green-300 hover:border-green-400'
                    : 'border-gray-400 bg-gray-200'
                }`}
                disabled={isHarvesting}
              >
                {/* Soil Background */}
                <Image
                  src="/images/soil.png"
                  alt="Soil"
                  fill
                  className={`object-cover ${!plot.isUnlocked ? 'grayscale opacity-50' : ''}`}
                />
                
                {/* Plant */}
                {plot.plant && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <Image
                        src={PLANT_DATA[plot.plant.type].image}
                        alt={PLANT_DATA[plot.plant.type].name}
                        width={48}
                        height={48}
                        className="w-16 h-16 object-contain"
                      />
                      
                      {/* Timer */}
                      {plot.plant.timeLeft > 0 && (
                        <div className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-green-600 border border-green-300">
                          {plot.plant.timeLeft}
                        </div>
                      )}
                      
                      {/* Ready indicator */}
                      {plot.plant.isReady && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Unlock button for locked plots */}
                {!plot.isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="text-center text-white">
                      {user.coins >= plot.unlockPrice ? (
                        <>
                          <div className="text-lg font-medium">🛒</div>
                          <div className="text-sm font-bold">💰 {plot.unlockPrice}</div>
                          <div className="text-xs text-green-300 font-medium">Купити</div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-medium">🔒</div>
                          <div className="text-sm font-bold">💰 {plot.unlockPrice}</div>
                          <div className="text-xs text-red-300 font-medium">
                            Потрібно: {plot.unlockPrice - user.coins} 💰
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Selected plant indicator */}
                {plot.isUnlocked && !plot.plant && selectedPlantType && user.coins >= PLANT_DATA[selectedPlantType].buyPrice && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20">
                    <div className="text-green-600 text-sm font-medium">
                      Садити {PLANT_DATA[selectedPlantType].name}
                    </div>
                  </div>
                )}
                
                {/* Insufficient funds indicator */}
                {plot.isUnlocked && !plot.plant && selectedPlantType && user.coins < PLANT_DATA[selectedPlantType].buyPrice && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20">
                    <div className="text-red-600 text-center">
                      <div className="text-2xl font-bold">⚠️</div>
                      <div className="text-xs font-medium">
                        Недостатньо коштів!
                      </div>
                      <div className="text-xs">
                        Потрібно: {PLANT_DATA[selectedPlantType].buyPrice} 💰
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Як грати:</p>
        <ul className="space-y-1 text-xs">
          <li>• Натисніть &quot;Виберіть рослину&quot; для відкриття списку</li>
          <li>• Натисніть на вільну грядку для посадки</li>
          <li>• Клікайте на рослину для прискорення росту</li>
          <li>• Збирайте урожай коли рослина готова</li>
          <li>• Розблокуйте нові грядки за монети</li>
        </ul>
      </div>

      {/* Plant Selection Modal */}
      <PlantSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handlePlantSelect}
        selectedPlantType={selectedPlantType}
      />
    </div>
  );
};
