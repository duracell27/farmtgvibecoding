import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Support both TELEGRAM_BOT_TOKEN and BOT_TOKEN (as on Vercel env screenshot)
    const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ success: false, error: 'Missing TELEGRAM_BOT_TOKEN' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      title = 'Purchase',
      description = 'In-app purchase',
      payload = 'stars_purchase',
      amountStars,
      providerData,
    }: {
      title?: string;
      description?: string;
      payload?: string;
      amountStars: number; // number of stars to charge (XTR). Bot API expects amount in minimal units (x100)
      providerData?: unknown;
    } = body || {};

    if (!amountStars || typeof amountStars !== 'number' || amountStars <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid amountStars' }, { status: 400 });
    }

    // Telegram Stars (XTR) expect amount as an integer number of stars (no *100)
    const prices = [{ label: 'Stars', amount: Math.round(amountStars) }];

    const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        payload,
        currency: 'XTR',
        prices,
        provider_data: providerData ?? undefined,
      }),
    });

    const data = await tgResponse.json();
    if (!data || !data.ok) {
      return NextResponse.json({ success: false, error: data?.description || 'Telegram API error', raw: data }, { status: 500 });
    }

    return NextResponse.json({ success: true, invoiceUrl: data.result });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}


