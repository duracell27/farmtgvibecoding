'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';

export default function ShopPage() {
  const { equipment, getEquipmentPrice, canBuyEquipment, buyOrUpgradeEquipment } = useGameStore();
  return (
    <main className="min-h-screen bg-green-50 p-4 pt-[100px] max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <Image src="/images/місто.png" alt="Магазин" width={28} height={28} className="w-8 h-8 object-contain" />
        <span className="text-2xl text-black font-bold">Магазин</span>
      </h1>

      <div className="w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h2 className="text-xl font-bold mb-2 flex items-center space-x-2">
            <span>🛒</span>
            <span>Техніка</span>
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {/* Watering */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💧</span>
                <div>
                  <div className="font-semibold">Поливалка</div>
                  <div className="text-xs text-gray-600">Поливає всі грядки за 1 натиск. Досвід за полив = базовий × рівень</div>
                  <div className="text-xs text-gray-800">Рівень: {equipment?.watering.level ?? 0} / 10</div>
                </div>
              </div>
              <div className="text-right">
                {(() => {
                  const lvl = equipment?.watering.level || 0;
                  const nextPrice = getEquipmentPrice('watering');
                  const isMax = lvl >= 10;
                  return (
                    <button
                      onClick={() => buyOrUpgradeEquipment('watering')}
                      disabled={isMax || !canBuyEquipment('watering')}
                      className={`px-3 py-2 rounded-lg font-semibold ${isMax ? 'bg-gray-200 text-gray-500' : canBuyEquipment('watering') ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-300 text-white'}`}
                    >
                      {isMax ? 'Макс' : (lvl === 0 ? 'Купити' : 'Покращити')} {nextPrice > 0 && (
                        <span className="ml-1 inline-flex items-center"><span>{nextPrice}</span><Image src="/images/смарагд.png" alt="Смарагд" width={18} height={18} className="w-5 h-5 object-contain ml-1"/></span>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Auto Watering */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="font-semibold">Система автоматичного поливу</div>
                  <div className="text-xs text-gray-600">Автоматично поливає грядки, коли кулдаун закінчився. Доступно після 1 рівня Поливалки</div>
                  <div className="text-xs text-gray-800">Рівень: {equipment?.autoWatering.level ?? 0} / 10</div>
                </div>
              </div>
              <div className="text-right">
                {(() => {
                  const lvl = equipment?.autoWatering.level || 0;
                  const nextPrice = getEquipmentPrice('autoWatering');
                  const isMax = lvl >= 10;
                  const can = canBuyEquipment('autoWatering');
                  return (
                    <button
                      onClick={() => buyOrUpgradeEquipment('autoWatering')}
                      disabled={isMax || !can}
                      className={`px-3 py-2 rounded-lg font-semibold ${isMax ? 'bg-gray-200 text-gray-500' : can ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-300 text-white'}`}
                    >
                      {isMax ? 'Макс' : (lvl === 0 ? 'Купити' : 'Покращити')} {nextPrice > 0 && (
                        <span className="ml-1 inline-flex items-center"><span>{nextPrice}</span><Image src="/images/смарагд.png" alt="Смарагд" width={18} height={18} className="w-5 h-5 object-contain ml-1"/></span>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Fertilizing */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <div className="font-semibold">Удобрювач</div>
                  <div className="text-xs text-gray-600">Аналог Поливалки для добрив. Досвід за добриво = базовий × рівень</div>
                  <div className="text-xs text-gray-800">Рівень: {equipment?.fertilizing.level ?? 0} / 10</div>
                </div>
              </div>
              <div className="text-right">
                {(() => {
                  const lvl = equipment?.fertilizing.level || 0;
                  const nextPrice = getEquipmentPrice('fertilizing');
                  const isMax = lvl >= 10;
                  return (
                    <button
                      onClick={() => buyOrUpgradeEquipment('fertilizing')}
                      disabled={isMax || !canBuyEquipment('fertilizing')}
                      className={`px-3 py-2 rounded-lg font-semibold ${isMax ? 'bg-gray-200 text-gray-500' : canBuyEquipment('fertilizing') ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-300 text-white'}`}
                    >
                      {isMax ? 'Макс' : (lvl === 0 ? 'Купити' : 'Покращити')} {nextPrice > 0 && (
                        <span className="ml-1 inline-flex items-center"><span>{nextPrice}</span><Image src="/images/смарагд.png" alt="Смарагд" width={18} height={18} className="w-5 h-5 object-contain ml-1"/></span>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Auto Fertilizing */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <div className="font-semibold">Система автоматичного удобрення</div>
                  <div className="text-xs text-gray-600">Автоматично застосовує обране добриво. Доступно після 1 рівня Удобрювача</div>
                  <div className="text-xs text-gray-800">Рівень: {equipment?.autoFertilizing.level ?? 0} / 10</div>
                </div>
              </div>
              <div className="text-right">
                {(() => {
                  const lvl = equipment?.autoFertilizing.level || 0;
                  const nextPrice = getEquipmentPrice('autoFertilizing');
                  const isMax = lvl >= 10;
                  const can = canBuyEquipment('autoFertilizing');
                  return (
                    <button
                      onClick={() => buyOrUpgradeEquipment('autoFertilizing')}
                      disabled={isMax || !can}
                      className={`px-3 py-2 rounded-lg font-semibold ${isMax ? 'bg-gray-200 text-gray-500' : can ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-300 text-white'}`}
                    >
                      {isMax ? 'Макс' : (lvl === 0 ? 'Купити' : 'Покращити')} {nextPrice > 0 && (
                        <span className="ml-1 inline-flex items-center"><span>{nextPrice}</span><Image src="/images/смарагд.png" alt="Смарагд" width={18} height={18} className="w-5 h-5 object-contain ml-1"/></span>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 w-full">
        <Link href="/city" className="w-full flex items-center justify-center bg-green-700 rounded-lg p-3 space-x-2 text-white hover:text-green-800 font-medium">
          <Image src="/images/місто.png" alt="Місто" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="text-xl font-bold">До Міста</span>
        </Link>
      </div>
    </main>
  );
}


