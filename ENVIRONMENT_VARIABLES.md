# Environment Variables

Для роботи додатку потрібні наступні змінні середовища:

## Локальна розробка (.env.local)

Створіть файл `.env.local` в корені проекту з наступним вмістом:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=farm_game

# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here

# Next.js Configuration
NODE_ENV=development
```

## Production (Vercel)

Додайте наступні змінні середовища в налаштуваннях Vercel:

### 1. MONGODB_URI
- **Опис:** URL підключення до MongoDB Atlas
- **Формат:** `mongodb+srv://username:password@cluster.mongodb.net/`
- **Приклад:** `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/`

### 2. MONGODB_DB
- **Опис:** Назва бази даних
- **Значення:** `farm_game`

### 3. BOT_TOKEN
- **Опис:** Токен вашого Telegram бота
- **Формат:** `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`
- **Як отримати:** Створіть бота через @BotFather в Telegram

## Як додати змінні в Vercel:

1. Перейдіть в Dashboard Vercel
2. Виберіть ваш проект
3. Перейдіть в Settings → Environment Variables
4. Додайте кожну змінну:
   - **Name:** MONGODB_URI
   - **Value:** ваш MongoDB URI
   - **Environment:** Production, Preview, Development
5. Повторіть для MONGODB_DB та BOT_TOKEN
6. Перезапустіть deployment

## Перевірка змінних:

Після додавання змінних перевірте:
1. Чи правильно налаштований MongoDB Atlas (IP whitelist, user permissions)
2. Чи правильно налаштований Telegram бот
3. Чи працюють API endpoints в Vercel logs

## Безпека:

- Ніколи не комітьте `.env.local` в git
- Використовуйте різні токени для development та production
- Обмежте доступ до MongoDB Atlas тільки з IP Vercel
