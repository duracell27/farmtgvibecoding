'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';

export default function AutoWateringPage() {
  const { equipment, getEquipmentPrice, canBuyEquipment, buyOrUpgradeEquipment } = useGameStore();
  const lvl = equipment?.autoWatering.level || 0;
  const nextPrice = getEquipmentPrice('autoWatering');
  const isMax = lvl >= 10;
  const can = canBuyEquipment('autoWatering');
  return (
    <main className="min-h-screen bg-green-50 p-4 pt-[100px] max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <span className="text-2xl">🤖</span>
        <span className="text-2xl text-black font-bold">Автополив</span>
      </h1>
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-700 mb-2">Автоматично поливає грядки, коли кулдаун закінчився. Доступно після 1 рівня Поливалки.</p>
        <div className="text-sm text-gray-800 mb-4">Поточний рівень: <b>{lvl}</b> / 10</div>
        <button
          onClick={() => buyOrUpgradeEquipment('autoWatering')}
          disabled={isMax || !can}
          className={`w-full px-3 py-2 rounded-lg font-semibold ${isMax ? 'bg-gray-200 text-gray-500' : can ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-300 text-white'}`}
        >
          {isMax ? 'Макс рівень' : (lvl === 0 ? 'Купити' : 'Покращити')} {nextPrice > 0 && (
            <span className="ml-1 inline-flex items-center"><span>{nextPrice}</span><Image src="/images/смарагд.png" alt="Смарагд" width={18} height={18} className="w-5 h-5 object-contain ml-1"/></span>
          )}
        </button>
      </div>
      <div className="mt-6">
        <Link href="/shop" className="inline-flex items-center text-green-700 font-semibold">← Повернутися</Link>
      </div>
    </main>
  );
}


