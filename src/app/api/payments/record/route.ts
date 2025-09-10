import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { userId, packageId, stars, emeralds, status, source, extra } = await req.json();
    if (!userId || !packageId) return NextResponse.json({ success: false, error: 'Missing userId/packageId' }, { status: 400 });
    const { db } = await connectToDatabase();
    const doc = {
      userId: String(userId),
      packageId,
      stars: typeof stars === 'number' ? stars : null,
      emeralds: typeof emeralds === 'number' ? emeralds : null,
      status: status || 'initiated',
      source: source || 'webapp',
      extra: extra || null,
      createdAt: Date.now(),
    };
    await db.collection('payments').insertOne(doc);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}


