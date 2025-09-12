import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  const { db } = await connectToDatabase();
  const messages = await db.collection('chatMessages')
    .find({})
    .sort({ createdAt: 1 })
    .limit(200)
    .toArray();
  return NextResponse.json({ success: true, messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userName, text } = body || {};
    if (!text || !userId) {
      return NextResponse.json({ success: false, error: 'Missing text/userId' }, { status: 400 });
    }
    const doc = {
      userId: String(userId),
      userName: userName || 'Користувач',
      text: String(text).slice(0, 500),
      createdAt: Date.now(),
    };
    const { db } = await connectToDatabase();
    await db.collection('chatMessages').insertOne(doc);
    return NextResponse.json({ success: true, message: doc });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}


