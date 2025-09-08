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
import { useLoadingPhrases } from '@/hooks/useLoadingPhrases';

export default function Home() {
  const { activeTab, startGame, levelUpModal, closeLevelUpModal, initialSyncDone } = useGameStore();
  const { isReady } = useTelegram();
  const { isInitialSyncComplete } = useGameSync();
  
  // Start the game timer
  useTimer();
  
  // Loading phrases
  // Show loader only before the very first sync; ignore isReady after that
  const isLoading = !initialSyncDone && (!isInitialSyncComplete || !isReady);
  const loadingPhrase = useLoadingPhrases(isLoading);

  // Start game when component mounts
  React.useEffect(() => {
    try {
      console.log('Home: Starting game', { isReady, isInitialSyncComplete });
      if (isReady) {
        startGame();
        console.log('Home: Game started successfully');
      }
    } catch (error) {
      console.error('Home: Error starting game:', error);
      console.error('Home: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        isReady,
        isInitialSyncComplete
      });
    }
  }, [isReady, isInitialSyncComplete, startGame]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-lg text-gray-600">Завантаження ферми...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4 transition-all duration-500">
            {loadingPhrase}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-green-50">
        <Header />
        
        <main className="pb-24 max-w-sm mx-auto" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }}>
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