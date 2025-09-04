'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Farm } from '@/components/Farm';
import { Footer } from '@/components/Footer';
import { Warehouse } from '@/components/Warehouse';
import { Achievements } from '@/components/Achievements';
import { Rating } from '@/components/Rating';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LevelUpModal } from '@/components/LevelUpModal';
import { useGameStore } from '@/store/gameStore';
import { useTimer } from '@/hooks/useTimer';
import { useTelegram } from '@/hooks/useTelegram';
import { useGameSync } from '@/hooks/useGameSync';

export default function Home() {
  const { activeTab, startGame, levelUpModal, closeLevelUpModal } = useGameStore();
  const { isReady } = useTelegram();
  
  // Start the game timer
  useTimer();
  
  // Initialize game sync
  useGameSync();

  // Start game when component mounts
  React.useEffect(() => {
    try {
      if (isReady) {
        startGame();
      }
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }, [isReady, startGame]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-lg text-gray-600">Завантаження ферми...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Якщо завантаження триває довго, спробуйте оновити сторінку
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-green-50">
        <Header />
        
        <main className="pb-20 max-w-sm mx-auto">
          {activeTab === 'farm' ? (
            <Farm />
          ) : activeTab === 'warehouse' ? (
            <Warehouse />
          ) : activeTab === 'achievements' ? (
            <Achievements />
          ) : (
            <Rating />
          )}
        </main>
        
        <Footer />
        
        {/* Level Up Modal */}
        <LevelUpModal
          isOpen={levelUpModal.isOpen}
          onClose={closeLevelUpModal}
          newLevel={levelUpModal.newLevel}
          newPlantType={levelUpModal.newPlantType}
          rewardCoins={levelUpModal.rewardCoins}
        />
      </div>
    </ErrorBoundary>
  );
}