"use client";

import Link from "next/link";
import { useGameStore, PLANT_DATA } from "@/store/gameStore";
import { useEffect } from "react";

export default function UpgradesPage() {
  const { upgrades, startPowerTask, initialSyncDone, syncStatus, loadGameState } = useGameStore();

  useEffect(() => {
    if (!initialSyncDone && syncStatus !== 'loading') {
      loadGameState();
    }
  }, [initialSyncDone, syncStatus, loadGameState]);

  const renderPowerProgress = () => {
    if (!upgrades?.activeTrack || upgrades.activeTrack !== 'power' || !upgrades.currentPowerTask) return null;
    const task = upgrades.currentPowerTask;
    let label = '';
    let current = 0;
    let target = 0;
    // Determine task label and progress
    if (task === 2 || task === 5 || task === 8) {
      // harvest one plant type
      target = task === 2 ? 500 : task === 5 ? 2000 : 5000;
      const plant = upgrades.currentPowerPlant || '';
      const plantName = plant ? (PLANT_DATA as Record<string, { name: string }>)[plant]?.name || plant : '';
      current = (upgrades.progress.harvestsByPlant[plant] || 0);
      label = `Виростити ${target} ${plantName}`;
    } else if (task === 3 || task === 6) {
      target = task === 3 ? 1000 : 10000;
      current = upgrades.progress.totalWaterings;
      label = `Полити ${target} раз`;
    } else if (task === 4 || task === 7) {
      target = task === 4 ? 2000 : 20000;
      current = upgrades.progress.totalFertilizers;
      label = `Удобрити ${target} раз`;
    }
    const percent = Math.min(100, target > 0 ? Math.floor((current / target) * 100) : 0);
    return (
      <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-800">{label}</div>
          <div className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">{percent}%</div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div className="h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all" style={{ width: `${percent}%` }} />
        </div>
        <div className="text-xs text-gray-600 mt-1 font-medium flex items-center justify-between">
          <span>{current.toLocaleString()} / {target.toLocaleString()}</span>
          <ClaimButton percent={percent} />
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-green-50 p-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-black">Покращення</h1>
      <p className="text-gray-700 text-sm mb-4">Обирайте напрямок: потужність або інтенсивність</p>

      <div className="space-y-4">
        <section className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
            <span>⚡</span>
            <span>Потужність (секунд за клік)</span>
          </h2>
          <div className="flex items-center justify-between mb-3 text-sm text-black">
            <div>Рівень: <span className="font-semibold">{upgrades?.powerLevel ?? 1}</span></div>
            <div className="flex items-center space-x-1">
              <span>⚡</span>
              <span>Поточна потужність: <span className="font-semibold">{upgrades?.powerPerClick ?? 1}c/клік</span></span>
            </div>
          </div>
          <div className="mb-3">
            {!(upgrades?.activeTrack === 'power' && upgrades?.currentPowerTask) && initialSyncDone && (
              <button onClick={startPowerTask} className="w-full bg-green-600 text-white rounded px-3 py-2 text-sm hover:bg-green-700">Почати завдання на потужність</button>
            )}
            {!initialSyncDone && (
              <div className="w-full bg-gray-100 rounded h-8 animate-pulse" />
            )}
          </div>
          {renderPowerProgress()}
          <div className="mt-3 text-xs text-gray-500">За раз можна виконувати тільки одне завдання (потужність або інтенсивність). Нове завдання пропонується автоматично.</div>
        </section>

        <section className="bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center space-x-2">
            <span>⏱️</span>
            <span>Інтенсивність (кожні X секунд)</span>
          </h2>
          <div className="text-sm text-gray-600">Завдання для інтенсивності з’являться, коли ти обереш цей трек. Зараз активний трек: <span className="font-semibold">{upgrades?.activeTrack === 'power' ? 'Потужність' : upgrades?.activeTrack === 'intensity' ? 'Інтенсивність' : '—'}</span>.</div>
        </section>

        <div className="text-center">
          <Link href="/" className="inline-flex bg-gray-700 rounded-lg px-3 py-2 text-white hover:bg-gray-800">⬅️ На ферму</Link>
        </div>
      </div>
    </main>
  );
}

function ClaimButton({ percent }: { percent: number }) {
  const { completePowerTask, upgrades } = useGameStore();
  if (!(upgrades?.activeTrack === 'power' && upgrades?.currentPowerTask)) return null;
  const disabled = percent < 100;
  return (
    <button
      onClick={completePowerTask}
      disabled={disabled}
      className={`px-3 py-1 rounded text-white text-xs font-semibold ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
    >
      Отримати
    </button>
  );
}


