"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGameStore, PLANT_DATA, FERTILIZER_DATA } from "@/store/gameStore";
import { PlantType, FertilizerType } from "@/types/game";
import { PlantSelectionModal } from "./PlantSelectionModal";
import { FertilizerModal } from "./FertilizerModal";

export const Farm = () => {
  const {
    farmPlots,
    user,
    selectedPlantType,
    selectedFertilizerType,
    clickPlant,
    plantSeed,
    unlockPlot,
    selectPlantType,
    selectFertilizerType,
    applyFertilizer,
    isHarvesting,
    waterPlant,
    clearPlot,
    toastMessage,
    toastType,
    clearToast,
  } = useGameStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFertilizerModalOpen, setIsFertilizerModalOpen] = useState(false);
  const [clickedPlantId, setClickedPlantId] = useState<string | null>(null);
  const [, setCooldownUpdate] = useState(0);
  const [clearConfirmPlotId, setClearConfirmPlotId] = useState<string | null>(null);

  // Update cooldown display every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldownUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePlotClick = (plotId: string) => {
    const plot = farmPlots.find((p) => p.id === plotId);


    if (!plot) return;

    if (!plot.isUnlocked) {
      // Try to unlock the plot
      unlockPlot(plotId);
      return;
    }

    if (plot.plant) {
      // Click on existing plant

      // Add click animation
      setClickedPlantId(plotId);
      setTimeout(() => setClickedPlantId(null), 200);

      clickPlant(plotId);
    } else if (selectedPlantType) {
      // Plant selected seed
      plantSeed(plotId, selectedPlantType);
    } else {
    }
  };

  const handlePlantSelect = (plantType: PlantType) => {
    selectPlantType(plantType);
  };

  const handleFertilizerSelect = (fertilizerType: FertilizerType) => {
    selectFertilizerType(fertilizerType);
  };

  const handleWaterPlant = (plotId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent plot click
    waterPlant(plotId);
  };

  const handleApplyFertilizer = (plotId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent plot click
    if (selectedFertilizerType) {
      applyFertilizer(plotId, selectedFertilizerType);
    }
  };

  const handleClearPlot = (plotId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent plot click
    setClearConfirmPlotId(plotId);
  };

  const confirmClearPlot = () => {
    if (clearConfirmPlotId) {
      clearPlot(clearConfirmPlotId);
      setClearConfirmPlotId(null);
    }
  };

  const cancelClearPlot = () => {
    setClearConfirmPlotId(null);
  };

  const getWateringCooldown = (plant: { isReady: boolean; lastWateredAt: number } | null) => {
    if (!plant || plant.isReady) return 0;
    const now = Date.now();
    const cooldown = 15000; // 15 seconds
    const timeSinceLastWater = now - plant.lastWateredAt;
    return Math.max(0, cooldown - timeSinceLastWater);
  };

  const getFertilizerCooldown = (
    plant: {
      isReady: boolean;
      plantedAt: number;
      lastFertilizedAt?: number;
      fertilizerApplied?: FertilizerType;
    } | null
  ) => {
    if (!plant || plant.isReady || plant.fertilizerApplied) return 0;

    const now = Date.now();
    const FERTILIZER_DELAY = 120000; // 2 minutes after planting

    // Check if 2 minutes have passed since planting
    const timeSincePlanting = now - plant.plantedAt;
    if (timeSincePlanting < FERTILIZER_DELAY) {
      return FERTILIZER_DELAY - timeSincePlanting;
    }

    return 0; // Can use fertilizer
  };

  const formatCooldownTime = (ms: number) => {
    return Math.ceil(ms / 1000);
  };

  const formatTimeLeftShort = (seconds: number) => {
    if (seconds >= 3600) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return m > 0 ? `${h}г ${m}хв` : `${h}г`;
    }
    if (seconds >= 60) {
      const m = Math.floor(seconds / 60);
      return `${m}хв`;
    }
    return `${seconds}с`;
  };

  const getCooldownProgress = (plant: { isReady: boolean; lastWateredAt: number } | null) => {
    if (!plant || plant.isReady) return 100; // No cooldown, fully available
    const cooldown = getWateringCooldown(plant);
    const totalCooldown = 15000; // 15 seconds
    return ((totalCooldown - cooldown) / totalCooldown) * 100; // Percentage of cooldown completed
  };

  const getFertilizerCooldownProgress = (
    plant: {
      isReady: boolean;
      plantedAt: number;
      lastFertilizedAt?: number;
      fertilizerApplied?: FertilizerType;
    } | null
  ) => {
    if (!plant || plant.isReady || plant.fertilizerApplied) return 100; // No cooldown, fully available
    const cooldown = getFertilizerCooldown(plant);
    const totalCooldown = 120000; // 2 minutes
    return ((totalCooldown - cooldown) / totalCooldown) * 100; // Percentage of cooldown completed
  };

  return (
    <div className="py-4 px-1 max-w-sm mx-auto">
      {toastMessage && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-[70] px-3 py-2 rounded-md text-white text-sm shadow-lg ${toastType === 'warning' ? 'bg-yellow-600' : toastType === 'error' ? 'bg-red-600' : 'bg-green-600'}`} onAnimationEnd={clearToast}>
          {toastMessage}
        </div>
      )}
      {/* Plant Selection and Fertilizer Buttons */}
      <div className="mb-6">
        <div className="flex items-center justify-evenly mb-4">
          
          <div className="flex space-x-2">
            {/* Plant Selection Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
            >
              {selectedPlantType ? (
                <>
                  <div className="w-8 h-8 overflow-hidden flex items-center justify-center">
                    <Image
                      src={PLANT_DATA[selectedPlantType].image}
                      alt={PLANT_DATA[selectedPlantType].name}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                      style={{ transform: 'scale(1.45)', transformOrigin: 'center' }}
                    />
                  </div>
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
                  <span>Рослина</span>
                </>
              )}
            </button>

            {/* Fertilizer Selection Button */}
            <button
              onClick={() => setIsFertilizerModalOpen(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-200 flex items-center space-x-2 relative"
            >
              {selectedFertilizerType ? (
                <>
                  <div className="w-8 h-8 overflow-hidden flex items-center justify-center">
                    <Image
                      src={FERTILIZER_DATA[selectedFertilizerType].image}
                      alt={FERTILIZER_DATA[selectedFertilizerType].name}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                      style={{ transform: 'scale(1.45)', transformOrigin: 'center' }}
                    />
                  </div>
                  <span>{FERTILIZER_DATA[selectedFertilizerType].name}</span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      selectFertilizerType(null);
                    }}
                    className="text-orange-200 hover:text-white ml-1 cursor-pointer"
                  >
                    ✕
                  </span>
                </>
              ) : (
                <>
                  <span>🌿</span>
                  <span>Добриво</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Farm Plots */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Грядки: {farmPlots.filter((p) => p.isUnlocked).length}/{farmPlots.length}
          </h3>
          {(() => {
            const lockedPlots = farmPlots.filter((p) => !p.isUnlocked);
            const nextPlot = lockedPlots[0]; // First locked plot


            if (nextPlot) {
              return (
                <div className="text-sm text-gray-600 flex items-center space-x-1">
                  <span>Наступна:</span>
                  <span className="font-medium">{nextPlot.unlockPrice}</span>
                  {nextPlot.unlockCurrency === 'emeralds' ? (
                    <Image src="/images/смарагд.png" alt="Смарагд" width={20} height={20} className="w-6 h-6 object-contain" />
                  ) : (
                    <Image src="/images/монета.png" alt="Монети" width={20} height={20} className="w-6 h-6 object-contain" />
                  )}
                </div>
              );
            }
            return <div className="text-sm text-green-600">Всі 7 грядок розблоковані! 🎉</div>;
          })()}
        </div>
        <div className="grid grid-cols-2 gap-4 rounded-lg p-2">
          {farmPlots
            .filter((plot) => {
              // Show unlocked plots and the next locked plot
              if (plot.isUnlocked) return true;

              // Find the first locked plot (next available for purchase)
              const lockedPlots = farmPlots.filter((p) => !p.isUnlocked);
              const firstLockedPlot = lockedPlots[0];

              return plot.id === firstLockedPlot?.id;
            })
            .map((plot, index) => (
              <div key={plot.id} className="relative">
                {/* Plot number for debugging */}
                <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded z-10">
                  {index + 1}
                </div>
                {/* Plot status - only show lock for locked plots */}
                {!plot.isUnlocked && (
                  <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded z-10">
                    🔒
                  </div>
                )}
                <button
                  onClick={() => handlePlotClick(plot.id)}
                  className={`aspect-square w-full rounded-lg transition-all relative overflow-hidden p-0 ${
                    plot.isUnlocked ? "" : "border-2 border-gray-400"
                  }`}
                  disabled={isHarvesting}
                >
                  {/* Soil as the main plot background */}
                  <div className={`w-full h-full relative ${!plot.isUnlocked ? "grayscale opacity-50" : ""}`}>
                    <Image src="/images/soil.png" alt="Soil" fill className="object-contain rounded-lg" />

                    {/* Plant positioned on top of soil */}
                    {plot.plant && (
                      <div className="absolute inset-0 flex items-center justify-start pl-[5%]">
                        <div
                          className={`relative transition-transform ease-in-out px-4 ${
                            clickedPlantId === plot.id ? "scale-85" : "scale-100"
                          }`}
                        >
                          <div className="w-16 h-16 overflow-hidden flex items-center justify-center -translate-y-3">
                            <Image
                              src={PLANT_DATA[plot.plant.type].image}
                              alt={PLANT_DATA[plot.plant.type].name}
                              width={70}
                              height={70}
                              className="w-full h-full object-contain"
                              style={{ transform: 'scale(1.45)', transformOrigin: 'center' }}
                            />
                          </div>

                          {/* Timer */}
                          {plot.plant.timeLeft > 0 && (
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-1 min-w-[3.5rem] flex items-center justify-center text-[10px] font-bold text-green-600 border border-green-300">
                              {formatTimeLeftShort(plot.plant.timeLeft)}
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

                    {/* Clear plot button */}
                    {plot.plant && (
                      <div className="absolute -top-1 -right-1">
                        <button
                          onClick={(e) => handleClearPlot(plot.id, e)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-200 bg-red-500/70 text-white hover:bg-red-600 active:scale-95"
                          title="Очистити грядку"
                        >
                          <span className="text-xs">🧹</span>
                        </button>
                      </div>
                    )}

                    {/* Watering and Fertilizer buttons */}
                    {plot.plant && !plot.plant.isReady && (
                      <div className="absolute bottom-8 right-2 flex flex-col space-y-7">
                        {/* Fertilizer button */}
                        {selectedFertilizerType && (
                          <div className="relative">
                            {(() => {
                              const cooldown = getFertilizerCooldown(plot.plant);
                              const isOnCooldown = cooldown > 0;
                              const cooldownSeconds = formatCooldownTime(cooldown);
                              const cooldownProgress = getFertilizerCooldownProgress(plot.plant);
                              const hasInsufficientFunds =
                                user.coins < FERTILIZER_DATA[selectedFertilizerType].price;
                              const isFertilizerApplied = !!plot.plant.fertilizerApplied;

                              return (
                                <>
                                  <button
                                    onClick={(e) => handleApplyFertilizer(plot.id, e)}
                                    disabled={hasInsufficientFunds || isOnCooldown || isFertilizerApplied}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 relative overflow-hidden ${
                                      hasInsufficientFunds || isOnCooldown || isFertilizerApplied
                                        ? "bg-orange-400 text-gray-500 cursor-not-allowed"
                                        : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
                                    }`}
                                    title={
                                      isFertilizerApplied
                                        ? "Добриво вже застосовано"
                                        : hasInsufficientFunds
                                        ? `Недостатньо коштів! Потрібно: ${
                                            FERTILIZER_DATA[selectedFertilizerType].price
                                          } 💰 (не вистачає: ${
                                            FERTILIZER_DATA[selectedFertilizerType].price - user.coins
                                          } 💰)`
                                        : isOnCooldown
                                        ? `Добриво можна застосувати через ${cooldownSeconds}с після посадки`
                                        : `Застосувати ${FERTILIZER_DATA[selectedFertilizerType].name}`
                                    }
                                  >
                                    {isFertilizerApplied ? (
                                      <span className="text-green-600 text-lg font-bold">✓</span>
                                    ) : (
                                      <Image
                                        src={FERTILIZER_DATA[selectedFertilizerType].image}
                                        alt={FERTILIZER_DATA[selectedFertilizerType].name}
                                        width={20}
                                        height={20}
                                        className="w-6 h-6 object-contain absolute z-10"
                                      />
                                    )}

                                    {/* Cooldown overlay - semi-transparent filter that moves from top to bottom */}
                                    {isOnCooldown && !isFertilizerApplied && (
                                      <div
                                        className="absolute inset-0 bg-white opacity-95 transition-all duration-100"
                                        style={{
                                          clipPath: `polygon(0 0, 100% 0, 100% ${
                                            100 - cooldownProgress
                                          }%, 0 ${100 - cooldownProgress}%)`,
                                        }}
                                      />
                                    )}
                                  </button>

                                  {/* Red coin indicator when insufficient funds - outside button to avoid overflow hidden */}
                                  {hasInsufficientFunds && !isFertilizerApplied && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full px-1 py-0.5 flex items-center justify-center min-w-[2rem] z-20">
                                      <span className="text-white text-xs font-bold">
                                        💰 {FERTILIZER_DATA[selectedFertilizerType].price}
                                      </span>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {/* Watering button */}
                        {(() => {
                          const cooldown = getWateringCooldown(plot.plant);
                          const isOnCooldown = cooldown > 0;
                          const cooldownSeconds = formatCooldownTime(cooldown);
                          const cooldownProgress = getCooldownProgress(plot.plant);

                          return (
                            <div className="relative">
                              <button
                                onClick={(e) => handleWaterPlant(plot.id, e)}
                                disabled={isOnCooldown}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 relative overflow-hidden ${
                                  isOnCooldown
                                    ? "bg-blue-400 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                                }`}
                                title={isOnCooldown ? `Кулдаун: ${cooldownSeconds}с` : "Полити рослину"}
                              >
                                <span className="text-xl absolute z-10">💧</span>

                                {/* Cooldown overlay - semi-transparent filter that moves from top to bottom */}
                                {isOnCooldown && (
                                  <div
                                    className="absolute inset-0 bg-white opacity-95 transition-all duration-100"
                                    style={{
                                      clipPath: `polygon(0 0, 100% 0, 100% ${100 - cooldownProgress}%, 0 ${
                                        100 - cooldownProgress
                                      }%)`,
                                    }}
                                  />
                                )}
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Unlock button for locked plots */}
                  {!plot.isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                      <div className="text-center text-white">
                        {user.coins >= plot.unlockPrice ? (
                          <>
                            <div className="text-lg font-medium">🛒</div>
                            <div className="text-sm font-bold flex items-center space-x-1 justify-center">
                              <span>{plot.unlockPrice}</span>
                              {plot.unlockCurrency === 'emeralds' ? (
                                <Image src="/images/смарагд.png" alt="Смарагд" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                              ) : (
                                <Image src="/images/монета.png" alt="Монети" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                              )}
                            </div>
                            <div className="text-xs text-green-300 font-medium">Купити</div>
                          </>
                        ) : (
                          <>
                            <div className="text-lg font-medium">🔒</div>
                            <div className="text-sm font-bold flex items-center space-x-1 justify-center">
                              <span>{plot.unlockPrice}</span>
                              {plot.unlockCurrency === 'emeralds' ? (
                                <Image src="/images/смарагд.png" alt="Смарагд" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                              ) : (
                                <Image src="/images/монета.png" alt="Монети" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                              )}
                            </div>
                            <div className="text-xs text-red-300 font-medium">
                              <span className="flex items-center justify-center space-x-1">
                                <span>Потрібно: {plot.unlockCurrency === 'emeralds' ? Math.max(0, plot.unlockPrice - user.emeralds) : Math.max(0, plot.unlockPrice - user.coins)}</span>
                                {plot.unlockCurrency === 'emeralds' ? (
                                  <Image src="/images/смарагд.png" alt="Смарагд" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                                ) : (
                                  <Image src="/images/монета.png" alt="Монети" width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                                )}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected plant indicator */}
                  {plot.isUnlocked &&
                    !plot.plant &&
                    selectedPlantType &&
                    user.coins >= PLANT_DATA[selectedPlantType].buyPrice && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20">
                        <div className="text-white flex flex-col items-center justify-center text-sm font-medium">
                          <div className="flex items-center space-x-1">
                            <span>Садити {PLANT_DATA[selectedPlantType].name}</span>
                            <span className="font-bold">{PLANT_DATA[selectedPlantType].buyPrice}</span>
                            <Image src="/images/монета.png" alt="Монети" width={16} height={16} className="w-4 h-4 object-contain" />
                          </div>
                          <div className="w-16 h-16 overflow-hidden flex items-center justify-center">
                            <Image src={PLANT_DATA[selectedPlantType].image} alt={PLANT_DATA[selectedPlantType].name} width={64} height={64} className="w-full h-full object-contain" style={{ transform: 'scale(1.45)', transformOrigin: 'center' }} />
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Insufficient funds indicator */}
                  {plot.isUnlocked &&
                    !plot.plant &&
                    selectedPlantType &&
                    user.coins < PLANT_DATA[selectedPlantType].buyPrice && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20">
                        <div className="text-white text-center">
                          <div className="text-2xl font-bold">⚠️</div>
                          <div className="text-xs font-medium">Недостатньо коштів!</div>
                          <div className="text-xs flex items-center justify-center space-x-1">
                            <span>Потрібно: {PLANT_DATA[selectedPlantType].buyPrice}</span>
                            <Image src="/images/монета.png" alt="Монети" width={12} height={12} className="w-3 h-3 object-contain" />
                          </div>
                        </div>
                      </div>
                    )}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Separator and City link */}
      <div className="my-4">
        <div className="border-t border-gray-200" />
        <div className="mt-3 w-full">
          <Link href="/city" className="flex bg-green-700 rounded-lg p-2 space-x-2 text-white hover:text-green-800 font-medium">
            <Image src="/images/місто.png" alt="Місто" width={20} height={20} className="w-7 h-7 object-contain" />
            <span className="text-xl font-bold">Місто</span>
          </Link>
        </div>
      </div>

      {/* Instructions */}
      {/* <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <p className="font-medium mb-1">Як грати:</p>
        <ul className="space-y-1 text-xs">
          <li>• Натисніть &quot;Рослина&quot; для вибору насіння</li>
          <li>• Натисніть &quot;Добриво&quot; для вибору добрива</li>
          <li>• Натисніть на вільну грядку для посадки</li>
          <li>• Клікайте на рослину для прискорення росту</li>
          <li>• Натисніть 💧 для поливу (зменшує час на 15с, кулдаун 15с)</li>
          <li>• Натисніть на іконку добрива для застосування</li>
          <li>• Добриво можна застосувати тільки через 2 хв після посадки</li>
          <li>• Добриво можна застосувати тільки один раз на рослину</li>
          <li>• 💰 50 показує ціну добрива при недостатності коштів (тільки на грядках)</li>
          <li>• Білий фільтр показує час до можливості застосування добрива</li>
          <li>• Натисніть 🧹 для очищення грядки від рослини</li>
          <li>• Збирайте урожай коли рослина готова</li>
          <li>• Розблокуйте нові грядки за монети</li>
        </ul>
      </div> */}

      {/* Plant Selection Modal */}
      <PlantSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handlePlantSelect}
        selectedPlantType={selectedPlantType}
      />

      {/* Fertilizer Selection Modal */}
      <FertilizerModal
        isOpen={isFertilizerModalOpen}
        onClose={() => setIsFertilizerModalOpen(false)}
        onSelect={handleFertilizerSelect}
        selectedFertilizerType={selectedFertilizerType}
      />

      {/* Clear Plot Confirmation Modal */}
      {clearConfirmPlotId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🧹</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Очистити грядку?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Ви впевнені, що хочете очистити цю грядку? Рослина буде втрачена безповоротно.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelClearPlot}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                >
                  Скасувати
                </button>
                <button
                  onClick={confirmClearPlot}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Очистити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
