import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();
    
    if (!initData) {
      return NextResponse.json({ error: 'No init data provided' }, { status: 400 });
    }

    // Parse init data
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    
    // Sort parameters
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN || '')
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Verify hash
    if (hash !== calculatedHash) {
      return NextResponse.json({ error: 'Invalid hash' }, { status: 401 });
    }

    // Parse user data
    const userParam = urlParams.get('user');
    if (userParam) {
      const user = JSON.parse(userParam);
      return NextResponse.json({ 
        valid: true, 
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url
        }
      });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Telegram validation error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
