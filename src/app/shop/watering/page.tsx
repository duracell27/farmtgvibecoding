"use client";

import Image from "next/image";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";

export default function WateringPage() {
  const { equipment, getEquipmentPrice, canBuyEquipment, buyOrUpgradeEquipment } = useGameStore();
  const lvl = equipment?.watering.level || 0;
  const nextPrice = getEquipmentPrice("watering");
  const isMax = lvl >= 10;
  const can = canBuyEquipment("watering");
  const reductions = [15, 25, 40, 60, 85, 115, 150, 190, 240, 300];
  const currentReduction = reductions[Math.max(0, Math.min(9, lvl - 1))];
  const nextReduction = lvl < 10 ? reductions[lvl] : null;
  return (
    <main className="min-h-screen bg-green-50 p-4 pt-[100px] max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center space-x-2">
        <span className="text-2xl">💧</span>
        <span className="text-2xl text-black font-bold">Поливалка</span>
      </h1>
      <div className="bg-white rounded-lg border p-4">
        <p className="text-sm text-gray-700 mb-2">
          Поливає всі грядки за 1 натиск. Досвід за полив = базовий × рівень.
        </p>
        <div className="text-sm text-gray-800 mb-4">
          Поточний рівень: <b>{lvl}</b> / 10
        </div>
        <div className="mb-4 space-y-1 text-sm text-gray-700">
          <div className="text-green-700">
            Поточне скорочення: <b>{currentReduction}с</b>
          </div>
          {nextReduction !== null ? (
            <div>
              Наступний рівень ({lvl + 1}): <b>{nextReduction}с</b>
            </div>
          ) : (
            <div className="text-green-700 font-semibold">Досягнуто максимального рівня</div>
          )}
        </div>
        <button
          onClick={() => buyOrUpgradeEquipment("watering")}
          disabled={isMax || !can}
          className={`w-full px-3 py-2 rounded-lg font-semibold ${
            isMax
              ? "bg-gray-200 text-gray-500"
              : can
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-300 text-white"
          }`}
        >
          {isMax ? "Макс рівень" : lvl === 0 ? "Купити" : "Покращити"}{" "}
          {nextPrice > 0 && (
            <span className="ml-1 inline-flex items-center">
              <span>{nextPrice}</span>
              <Image
                src="/images/смарагд.png"
                alt="Смарагд"
                width={18}
                height={18}
                className="w-5 h-5 object-contain ml-1"
              />
            </span>
          )}
        </button>
      </div>
      <div className="mt-6">
        <Link href="/shop" className="inline-flex items-center text-green-700 font-semibold">
          ← Повернутися
        </Link>
      </div>
    </main>
  );
}
