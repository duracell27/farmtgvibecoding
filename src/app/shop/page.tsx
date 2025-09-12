'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';

export default function ShopPage() {
  const { equipment } = useGameStore();
  const wl = equipment?.watering.level ?? 0;
  const awl = equipment?.autoWatering.level ?? 0;
  const fl = equipment?.fertilizing.level ?? 0;
  const afl = equipment?.autoFertilizing.level ?? 0;
  return (
    <main className="min-h-screen bg-green-50 p-4 pt-[100px] max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <Image src="/images/місто.png" alt="Магазин" width={28} height={28} className="w-8 h-8 object-contain" />
        <span className="text-2xl text-black font-bold">Магазин</span>
      </h1>

      <div className="grid grid-cols-1 gap-3">
        <Link href="/shop/watering" className="flex items-center justify-between p-3 rounded-lg border bg-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💧</span>
            <div>
              <div className="font-semibold">Поливалка <span className="text-gray-600 text-xs">({wl}/10)</span></div>
              <div className="text-xs text-gray-600">Поливає всі грядки за 1 натиск</div>
            </div>
          </div>
          <span className="text-green-700 font-semibold">Відкрити →</span>
        </Link>
        <Link href="/shop/auto-watering" className="flex items-center justify-between p-3 rounded-lg border bg-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="font-semibold">Автополив <span className="text-gray-600 text-xs">({awl}/10)</span></div>
              <div className="text-xs text-gray-600">Поливає автоматично</div>
            </div>
          </div>
          <span className="text-green-700 font-semibold">Відкрити →</span>
        </Link>
        <Link href="/shop/fertilizing" className="flex items-center justify-between p-3 rounded-lg border bg-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🌿</span>
            <div>
              <div className="font-semibold">Удобрювач <span className="text-gray-600 text-xs">({fl}/10)</span></div>
              <div className="text-xs text-gray-600">Масове удобрення</div>
            </div>
          </div>
          <span className="text-green-700 font-semibold">Відкрити →</span>
        </Link>
        <Link href="/shop/auto-fertilizing" className="flex items-center justify-between p-3 rounded-lg border bg-white">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="font-semibold">Автоудобрення <span className="text-gray-600 text-xs">({afl}/10)</span></div>
              <div className="text-xs text-gray-600">Авто-застосування добрив</div>
            </div>
          </div>
          <span className="text-green-700 font-semibold">Відкрити →</span>
        </Link>
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


