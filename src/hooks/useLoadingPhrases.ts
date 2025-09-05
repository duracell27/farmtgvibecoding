'use client';

import { useState, useEffect } from 'react';

const FARMING_PHRASES = [
  'Обробляємо грядки...',
  'Поливаємо помідори...',
  'Вскопуємо землю...',
  'Сіємо насіння...',
  'Збираємо урожай...',
  'Підживлюємо рослини...',
  'Прополюємо бур&apos;яни...',
  'Підготовлюємо грунт...',
  'Розсаджую саджанці...',
  'Доглядаємо за рослинами...',
  'Збираємо досягнення...',
  'Налаштовуємо ферму...',
  'Підготуємо інвентар...',
  'Перевіряємо стан рослин...',
  'Оновлюємо склад...',
];

export const useLoadingPhrases = (isLoading: boolean) => {
  const [currentPhrase, setCurrentPhrase] = useState(FARMING_PHRASES[0]);

  useEffect(() => {
    if (!isLoading) {
      setCurrentPhrase(FARMING_PHRASES[0]);
      return;
    }

    let phraseIndex = 0;
    setCurrentPhrase(FARMING_PHRASES[phraseIndex]);

    const interval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % FARMING_PHRASES.length;
      setCurrentPhrase(FARMING_PHRASES[phraseIndex]);
    }, 1500); // Змінюємо фразу кожні 1.5 секунди

    return () => clearInterval(interval);
  }, [isLoading]);

  return currentPhrase;
};
