'use client';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">🌱 Як грати?</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">🎯 Основна мета</h3>
              <p>Вирощуйте рослини, збирайте урожай та підвищуйте свій рівень!</p>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">🌱 Посадка рослин</h3>
              <ul className="space-y-1 ml-4">
                <li>• Натисніть &quot;Рослина&quot; для вибору насіння</li>
                <li>• Натисніть &quot;Добриво&quot; для вибору добрива</li>
                <li>• Клікніть на вільну грядку для посадки</li>
                <li>• Клікайте на рослину для прискорення росту</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">💧 Полив рослин</h3>
              <ul className="space-y-1 ml-4">
                <li>• Натисніть 💧 для поливу (зменшує час на 15с)</li>
                <li>• Кулдаун поливу: 15 секунд</li>
                <li>• Білий фільтр показує прогрес кулдауну</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">🌿 Добрива</h3>
              <ul className="space-y-1 ml-4">
                <li>• Добриво можна застосувати через 2 хв після посадки</li>
                <li>• Добриво можна використати тільки один раз на рослину</li>
                <li>• Після застосування з&apos;являється галочка ✓</li>
                <li>• 💰 показує ціну при недостатності коштів</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">🏆 Досягнення</h3>
              <ul className="space-y-1 ml-4">
                <li>• Виконуйте завдання для отримання нагород</li>
                <li>• Червона крапка показує нові досягнення</li>
                <li>• Натисніть &quot;Отримати&quot; для закриття нагороди</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">📊 Рейтинг</h3>
              <ul className="space-y-1 ml-4">
                <li>• Порівнюйте свої результати з іншими гравцями</li>
                <li>• Рейтинги за рівнем, урожаями та кліками</li>
                <li>• Оновлюйте дані кнопкою &quot;Оновити&quot;</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-green-600 mb-2">💰 Монети та рівні</h3>
              <ul className="space-y-1 ml-4">
                <li>• Заробляйте монети за збір урожаю</li>
                <li>• Витрачайте монети на нові грядки та насіння</li>
                <li>• Підвищуйте рівень за досвід</li>
                <li>• Розблоковуйте нові рослини та добрива</li>
              </ul>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-green-800 font-medium">
                💡 Порада: Гра автоматично зберігається кожні 30 секунд!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Зрозуміло!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
