import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
    if (!botToken) return NextResponse.json({ success: false, error: 'Missing BOT_TOKEN' }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const { chatId, title, description, payload, amountStars } = body || {};
    if (!chatId || !amountStars) return NextResponse.json({ success: false, error: 'chatId and amountStars required' }, { status: 400 });

    const prices = [{ label: 'Stars', amount: Math.round(amountStars) }];

    const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendInvoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: String(chatId),
        title: title || 'Mini Farm Purchase',
        description: description || 'Purchase in Mini Farm',
        payload: payload || `purchase_${Date.now()}`,
        provider_token: '', // XTR does not require provider token
        currency: 'XTR',
        prices,
      })
    });
    const data = await resp.json();
    if (!data?.ok) return NextResponse.json({ success: false, error: data?.description || 'Telegram API error', raw: data }, { status: 500 });
    return NextResponse.json({ success: true, result: data.result });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}


