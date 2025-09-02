'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export const Warehouse = () => {
  const { warehouse, sellProduct } = useGameStore();
  const [sellAmount, setSellAmount] = useState(1);

  const handleSell = (product: keyof typeof warehouse, amount: number) => {
    if (warehouse[product] >= amount) {
      sellProduct(product, amount);
    }
  };

  const getProductInfo = (product: keyof typeof warehouse) => {
    switch (product) {
      case 'onion':
        return {
          name: 'Цибуля',
          emoji: '🧅',
          price: 3,
        };
      default:
        return {
          name: 'Невідомий продукт',
          emoji: '❓',
          price: 0,
        };
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          📦 Склад
        </h2>
        
        <div className="space-y-4">
          {Object.entries(warehouse).map(([product, amount]) => {
            const productInfo = getProductInfo(product as keyof typeof warehouse);
            
            return (
              <div
                key={product}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{productInfo.emoji}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {productInfo.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Ціна: {productInfo.price} 💰 за штуку
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {amount}
                    </div>
                    <div className="text-sm text-gray-500">шт.</div>
                  </div>
                </div>
                
                {amount > 0 && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={amount}
                      value={sellAmount}
                      onChange={(e) => setSellAmount(Math.max(1, Math.min(amount, parseInt(e.target.value) || 1)))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-center"
                    />
                    <button
                      onClick={() => handleSell(product as keyof typeof warehouse, sellAmount)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      Продати
                    </button>
                  </div>
                )}
                
                {amount === 0 && (
                  <div className="text-center text-gray-500 py-2">
                    Немає продукції
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {Object.values(warehouse).every(amount => amount === 0) && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-lg">Склад порожній</p>
            <p className="text-sm">Вирощуйте рослини на фермі!</p>
          </div>
        )}
      </div>
    </div>
  );
};
