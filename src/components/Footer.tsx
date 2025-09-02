'use client';

import { useGameStore } from '@/store/gameStore';

export const Footer = () => {
  const { activeTab, setActiveTab } = useGameStore();

  return (
    <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
      <div className="max-w-md mx-auto">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('farm')}
            className={`flex-1 py-4 px-6 text-center transition-colors duration-200 ${
              activeTab === 'farm'
                ? 'bg-green-100 text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-2xl">🌱</span>
              <span className="text-sm font-medium">Ферма</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`flex-1 py-4 px-6 text-center transition-colors duration-200 ${
              activeTab === 'warehouse'
                ? 'bg-green-100 text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <span className="text-2xl">📦</span>
              <span className="text-sm font-medium">Склад</span>
            </div>
          </button>
        </nav>
      </div>
    </footer>
  );
};
