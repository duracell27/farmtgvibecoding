'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function ExchangePage() {
  const { user, exchange, exchangeCoinsForEmeraldsByCoins, exchangeMaxToday, getExchangeRemainingToday } = useGameStore();
  const [coinsInput, setCoinsInput] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const msLeft = Math.max(0, exchange.resetAt - now);
      setCountdown(msLeft);
    };
    updateCountdown();
    const t = setInterval(updateCountdown, 1000);
    return () => clearInterval(t);
  }, [exchange.resetAt]);

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleExchange = () => {
    const coins = Math.max(0, Math.floor(Number(coinsInput) || 0));
    exchangeCoinsForEmeraldsByCoins(coins);
    setCoinsInput('');
  };

  const remainingToday = getExchangeRemainingToday();
  const COINS_PER_EMERALD = 1000;
  const canExchange = remainingToday > 0 && user.coins >= COINS_PER_EMERALD;

  return (
    <main className="min-h-screen bg-green-50 p-4 pt-[100px] max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <Image src="/images/обмін.png" alt="Обмін" width={28} height={28} className="w-8 h-8 object-contain" />
        <span className="text-2xl text-black font-bold">Обмін</span>
      </h1>

      {/* Exchange panel */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 text-gray-800">
        <div className="space-y-3">
        <div className="text-sm inline-flex items-center space-x-1">
          <span>Курс:</span>
          <span className="font-semibold">1000</span>
          <Image src="/images/монета.png" alt="Монети" width={20} height={20} className="w-5 h-5 object-contain" />
          <span>→</span>
          <span className="font-semibold">1</span>
          <Image src="/images/смарагд.png" alt="Смарагд" width={20} height={20} className="w-5 h-5 object-contain" />
        </div>
          <div className="text-sm">Ліміт на сьогодні: <span className="font-semibold">{remainingToday}</span> / {user.level}</div>
          <div className="text-sm">Наступний обмін (через {formatCountdown(countdown)})</div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={COINS_PER_EMERALD}
              step={COINS_PER_EMERALD}
              value={coinsInput}
              onChange={(e) => setCoinsInput(e.target.value)}
              placeholder="Скільки монет обміняти"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-black placeholder:text-gray-400"
            />
            <button
              onClick={handleExchange}
              disabled={!canExchange}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Обміняти
            </button>
          </div>

          <button
            onClick={exchangeMaxToday}
            disabled={!canExchange}
            className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center">
              <span>Обміняти все доступне (</span>
              <span>{Math.min(remainingToday, Math.floor(user.coins / COINS_PER_EMERALD))}</span>
              <Image src="/images/смарагд.png" alt="Смарагд" width={20} height={20} className="w-5 h-5 object-contain" />
              <span>)</span>
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 w-full">
        <Link href="/city" className="w-full flex items-center justify-center bg-green-700 rounded-lg p-3 space-x-2 text-white hover:text-green-800 font-medium">
          <Image src="/images/місто.png" alt="Місто" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="text-xl font-bold">Місто</span>
        </Link>
      </div>
    </main>
  );
}


