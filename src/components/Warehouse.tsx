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

  const handleSellAll = (product: keyof typeof warehouse) => {
    if (warehouse[product] > 0) {
      sellProduct(product, warehouse[product]);
    }
  };

  const handleSellEverything = () => {
    Object.entries(warehouse).forEach(([product, amount]) => {
      if (amount > 0) {
        sellProduct(product as keyof typeof warehouse, amount);
      }
    });
  };

  const getTotalValue = () => {
    return Object.entries(warehouse).reduce((total, [product, amount]) => {
      const productInfo = getProductInfo(product as keyof typeof warehouse);
      return total + (amount * productInfo.price);
    }, 0);
  };

  const getProductValue = (product: keyof typeof warehouse) => {
    const productInfo = getProductInfo(product);
    return warehouse[product] * productInfo.price;
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📦 Склад
          </h2>
          {getTotalValue() > 0 && (
            <button
              onClick={handleSellEverything}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 font-medium text-sm"
            >
              Продати все ({getTotalValue().toLocaleString()} 💰)
            </button>
          )}
        </div>
        
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
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max={amount}
                        value={sellAmount}
                        onChange={(e) => setSellAmount(Math.max(1, Math.min(amount, parseInt(e.target.value) || 1)))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-center text-black placeholder:text-black"
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
                    
                    <button
                      onClick={() => {
                        handleSellAll(product as keyof typeof warehouse);
                        // Hide keyboard after selling
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                    >
                      Продати все ({getProductValue(product as keyof typeof warehouse).toLocaleString()} 💰)
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
