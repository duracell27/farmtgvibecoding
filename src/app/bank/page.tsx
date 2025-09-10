"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
// Telegram WebApp typings are optional at runtime; we'll use a lite interface below

interface TelegramWebAppLite {
  showPopup: (
    params: {
      title?: string;
      message: string;
      buttons?: Array<{
        id?: string;
        type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
        text?: string;
      }>;
    },
    callback?: (buttonId: string) => void
  ) => void;
  showAlert: (message: string, callback?: () => void) => void;
}

export default function BankPage() {
  const { user, addCoins, addEmeralds, saveGameState } = useGameStore();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Bank packages for coins and emeralds
  const coinPackages = [
    { id: 'coins-10000', name: '10,000 монет', price: 25, coins: 10000, emeralds: 0, popular: false },
    { id: 'coins-50000', name: '50,000 монет', price: 50, coins: 50000, emeralds: 0, popular: false },
    { id: 'coins-100000', name: '100,000 монет', price: 100, coins: 100000, emeralds: 0, popular: true },
    { id: 'coins-500000', name: '500,000 монет', price: 200, coins: 500000, emeralds: 0, popular: false },
  ];

  const emeraldPackages = [
    { id: 'emeralds-test-50', name: 'ТЕСТ: 50 смарагдів', price: 10, coins: 0, emeralds: 50, popular: false },
    { id: 'emeralds-100', name: '100 смарагдів', price: 50, coins: 0, emeralds: 100, popular: false },
    { id: 'emeralds-220', name: '220 смарагдів', price: 100, coins: 0, emeralds: 220, popular: false },
    { id: 'emeralds-550', name: '550 смарагдів', price: 250, coins: 0, emeralds: 550, popular: true },
    { id: 'emeralds-1150', name: '1,150 смарагдів', price: 500, coins: 0, emeralds: 1150, popular: false },
    { id: 'emeralds-2750', name: '2,750 смарагдів', price: 1200, coins: 0, emeralds: 2750, popular: false },
  ];

  const handlePurchase = async (packageId: string) => {
    const allPackages = [...coinPackages, ...emeraldPackages];
    const selectedPkg = allPackages.find(pkg => pkg.id === packageId);
    
    if (!selectedPkg) return;

    try {
      // Check if we're in Telegram WebApp
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp as unknown as TelegramWebAppLite & { openInvoice?: (url: string, cb?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void) => void };

        // Temporary: bypass payment for TEST package to validate crediting/saving
        if (selectedPkg.id === 'emeralds-test-50') {
          if (selectedPkg.emeralds > 0) addEmeralds(selectedPkg.emeralds);
          try { await saveGameState(); } catch {}
          tg.showAlert('ТЕСТ пакет зараховано без списання зірок.');
          return;
        }

        // Create invoice via our API (amount in Stars)
        const resp = await fetch('/api/payments/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: selectedPkg.name,
            description: selectedPkg.name,
            amountStars: selectedPkg.price,
            payload: packageId,
          }),
        });
        const data = await resp.json();
        if (!data.success || !data.invoiceUrl) {
          const msg = data?.error || 'Не вдалося створити інвойс';
          if (window.Telegram?.WebApp) {
            const tgLite = window.Telegram.WebApp as unknown as TelegramWebAppLite;
            tgLite.showAlert(`Помилка: ${msg}`);
          } else {
            alert(`Помилка: ${msg}`);
          }
          return;
        }

        // Attach invoiceClosed fallback listener (some clients don't call callback)
        const webapp = window.Telegram?.WebApp as unknown as {
          onEvent?: (event: 'invoiceClosed', handler: (e: { status: 'paid' | 'cancelled' | 'failed' | 'pending' }) => void) => void;
          offEvent?: (event: 'invoiceClosed', handler: (e: { status: 'paid' | 'cancelled' | 'failed' | 'pending' }) => void) => void;
        } | undefined;
        let closedHandled = false;
        const tgLite = window.Telegram.WebApp as unknown as TelegramWebAppLite;
        const offIfAny = () => {
          if (webapp && typeof webapp.offEvent === 'function' && handler) {
            try { webapp.offEvent('invoiceClosed', handler); } catch {}
          }
        };
        const onPaid = async () => {
          closedHandled = true;
          if (selectedPkg.coins > 0) addCoins(selectedPkg.coins);
          if (selectedPkg.emeralds > 0) addEmeralds(selectedPkg.emeralds);
          try { await saveGameState(); } catch {}
          offIfAny();
        };
        const handler = (event: { status: 'paid' | 'cancelled' | 'failed' | 'pending' }) => {
          try { console.log('[bank] invoiceClosed event:', event); } catch {}
          if (!event || !event.status) return;
          if (event.status === 'paid') { onPaid(); tgLite?.showAlert(`Оплата успішна (invoiceClosed): ${JSON.stringify(event)}`); }
          else if (event.status === 'cancelled') { closedHandled = true; offIfAny(); tgLite?.showAlert(`Покупку скасовано: ${JSON.stringify(event)}`); }
          else if (event.status === 'failed') { closedHandled = true; offIfAny(); tgLite?.showAlert(`Оплата не пройшла: ${JSON.stringify(event)}`); }
          else if (event.status === 'pending') { tgLite?.showAlert(`Оплата очікується: ${JSON.stringify(event)}`); }
        };
        if (webapp && typeof webapp.onEvent === 'function') {
          try { webapp.onEvent('invoiceClosed', handler); } catch {}
        }

        if (typeof tg.openInvoice === 'function') {
          tg.openInvoice(data.invoiceUrl, async (status) => {
            try { console.log('[bank] openInvoice callback status:', status); } catch {}
            if (status === 'paid') { await onPaid(); tgLite?.showAlert(`Оплата успішна (cb): ${status}`); }
            else if (status === 'cancelled') { tgLite?.showAlert(`Покупку скасовано (cb): ${status}`); }
            else if (status === 'failed') { tgLite?.showAlert(`Оплата не пройшла (cb): ${status}`); }
            else if (status === 'pending') { tgLite?.showAlert(`Оплата очікується (cb): ${status}`); }
          });
          // Failsafe timeout: if invoice closes without callback, rely on 'invoiceClosed' or ignore
          setTimeout(() => { if (!closedHandled) offIfAny(); }, 120000);
        } else {
          // Fallback: open link
          window.open(data.invoiceUrl, '_blank');
        }
      } else {
        // Fallback for development/testing
        if (selectedPkg.coins > 0) addCoins(selectedPkg.coins);
        if (selectedPkg.emeralds > 0) addEmeralds(selectedPkg.emeralds);
        try { await saveGameState(); } catch {}
        alert(`Покупка успішна! Отримано: ${selectedPkg.coins > 0 ? selectedPkg.coins + ' монет' : selectedPkg.emeralds + ' смарагдів'}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Помилка при обробці платежу. Спробуйте ще раз.');
    }
  };

  return (
    <div className="py-4 px-1 max-w-sm mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🏦</div>
        <h1 className="text-2xl font-bold text-gray-800">Банк</h1>
        <p className="text-gray-600">Купуйте монети та смарагди</p>
        <div className="mt-2 text-sm text-blue-600 flex items-center justify-center space-x-1">
          <span>⭐</span>
          <span>Оплата через Telegram Stars</span>
        </div>
      </div>

      {/* Current Balance */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Ваш баланс</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/images/монета.png" alt="Монети" width={24} height={24} className="w-6 h-6 object-contain" />
            <span className="text-lg font-bold text-yellow-600">{user.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/images/смарагд.png" alt="Смарагди" width={24} height={24} className="w-6 h-6 object-contain" />
            <span className="text-lg font-bold text-green-600">{user.emeralds.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Emerald Packages */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Image src="/images/смарагд.png" alt="Смарагди" width={20} height={20} className="w-5 h-5 object-contain mr-2" />
          Смарагди
        </h2>
        <div className="space-y-2">
          {emeraldPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg p-4 shadow-md border-2 transition-all duration-200 ${
                selectedPackage === pkg.id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Image src="/images/смарагд.png" alt="Смарагди" width={32} height={32} className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {pkg.id === 'emeralds-220' ? '220' :
                       pkg.id === 'emeralds-550' ? '550' :
                       pkg.id === 'emeralds-1150' ? '1,150' :
                       pkg.id === 'emeralds-2750' ? '2,750' :
                       pkg.emeralds.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">{pkg.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {pkg.popular && (
                      <span className="bg-green-400 text-green-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                        популярне
                      </span>
                    )}
                    <div className="text-base flex items-center whitespace-nowrap font-bold text-gray-800">⭐ {pkg.price}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(pkg.id);
                    }}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-semibold"
                  >
                    Купити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coin Packages */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Image src="/images/монета.png" alt="Монети" width={20} height={20} className="w-5 h-5 object-contain mr-2" />
          Монети
        </h2>
        <div className="space-y-2">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg p-4 shadow-md border-2 transition-all duration-200 ${
                selectedPackage === pkg.id 
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Image src="/images/монета.png" alt="Монети" width={32} height={32} className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      {pkg.coins.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">{pkg.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {pkg.popular && (
                      <span className="bg-yellow-400 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                          популярне
                      </span>
                    )}
                    <div className="text-base flex items-center whitespace-nowrap font-bold text-gray-800">⭐ {pkg.price}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(pkg.id);
                    }}
                    className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-sm font-semibold"
                  >
                    Купити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Farm */}
      <div className="mt-6">
        <Link href="/" className="flex bg-gray-700 rounded-lg p-3 space-x-2 text-white hover:bg-gray-800 font-medium justify-center">
          <span>🏠</span>
          <span className="text-lg font-bold">Повернутися на ферму</span>
        </Link>
      </div>
    </div>
  );
}
