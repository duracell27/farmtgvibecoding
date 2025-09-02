'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Plant } from '@/components/Plant';
import { Footer } from '@/components/Footer';
import { Warehouse } from '@/components/Warehouse';
import { useGameStore } from '@/store/gameStore';
import { useTimer } from '@/hooks/useTimer';
import { useTelegram } from '@/hooks/useTelegram';

export default function Home() {
  const { activeTab, startGame } = useGameStore();
  const { isReady } = useTelegram();
  
  // Start the game timer
  useTimer();

  // Start game when component mounts
  React.useEffect(() => {
    if (isReady) {
      startGame();
    }
  }, [isReady, startGame]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <p className="text-lg text-gray-600">Завантаження ферми...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      <Header />
      
      <main className="pb-20">
        {activeTab === 'farm' ? (
          <Plant />
        ) : (
          <Warehouse />
        )}
      </main>
      
      <Footer />
    </div>
  );
}