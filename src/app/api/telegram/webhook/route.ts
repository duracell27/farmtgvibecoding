import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Pre-checkout: must answer OK for Stars
    if (body?.pre_checkout_query) {
      const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
      const queryId = body.pre_checkout_query.id;
      const userId = body.pre_checkout_query.from?.id;
      await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pre_checkout_query_id: queryId, ok: true })
      });
      // Notify user that payment is approved to proceed
      if (userId) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: String(userId), text: '✅ Запит на оплату отримано. Завершіть оплату у відкритому вікні.' })
        });
      }
      return NextResponse.json({ ok: true });
    }

    // Successful payment: credit emeralds based on payload
    const msg = body?.message;
    if (msg?.successful_payment) {
      const userId = String(msg.from?.id || '');
      const payload: string = msg.successful_payment?.invoice_payload || '';
      // Parse amount from payload, e.g., emeralds_50
      const emeraldsMatch = /emeralds_(\d+)/.exec(payload);
      const emeraldsToAdd = emeraldsMatch ? parseInt(emeraldsMatch[1], 10) : 0;
      if (userId && emeraldsToAdd > 0) {
        const { db } = await connectToDatabase();
        await db.collection('gameStates').updateOne(
          { 'user.id': userId },
          { $inc: { 'user.emeralds': emeraldsToAdd }, $set: { lastSyncTime: Date.now() } },
          { upsert: true }
        );
        // Notify user
        const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: userId, text: `✅ Оплата успішна. Зараховано ${emeraldsToAdd} смарагдів.` })
        });
      }
      return NextResponse.json({ ok: true });
    }

    // Simple ping to confirm webhook is alive
    if (msg?.text === '/ping') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: String(msg.chat.id), text: '🟢 Webhook працює' })
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}


