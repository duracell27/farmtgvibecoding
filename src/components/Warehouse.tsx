'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore, PLANT_DATA } from '@/store/gameStore';
import { PlantType } from '@/types/game';

export const Warehouse = () => {
  const { warehouse, sellProduct } = useGameStore();
  const [sellAmount, setSellAmount] = useState(1);

  // Hide keyboard when component unmounts or when switching tabs
  useEffect(() => {
    return () => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };
  }, []);

  const handleSell = (product: keyof typeof warehouse, amount: number) => {
    if (warehouse[product] >= amount) {
      sellProduct(product, amount);
    }
  };

  const getProductInfo = (product: keyof typeof warehouse) => {
    const plantData = PLANT_DATA[product as PlantType];
    return {
      name: plantData.name,
      image: plantData.image,
      price: plantData.sellPrice,
    };
  };

  return (
    <div className="p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          📦 Склад
        </h2>
        
        <div className="space-y-4">
          {Object.entries(warehouse)
            .filter(([, amount]) => amount > 0)
            .map(([product, amount]) => {
              const productInfo = getProductInfo(product as keyof typeof warehouse);
              
              return (
                <div
                  key={product}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={productInfo.image}
                        alt={productInfo.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain"
                      />
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
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={amount}
                      value={sellAmount}
                      onChange={(e) => setSellAmount(Math.max(1, Math.min(amount, parseInt(e.target.value) || 1)))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-center"
                      onBlur={() => {
                        // Hide keyboard when input loses focus
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        handleSell(product as keyof typeof warehouse, sellAmount);
                        // Hide keyboard after selling
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      Продати
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
        
        {Object.values(warehouse).every((amount) => amount === 0) && (
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
