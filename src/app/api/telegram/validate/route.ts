import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Simple in-memory cache for validation results
interface ValidationResult {
  valid: boolean;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
  };
}

const validationCache = new Map<string, { result: ValidationResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();
    
    if (!initData) {
      return NextResponse.json({ error: 'No init data provided' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = crypto.createHash('md5').update(initData).digest('hex');
    const cached = validationCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('Telegram validation: Using cached result');
      return NextResponse.json(cached.result);
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
    let result;
    
    if (userParam) {
      const user = JSON.parse(userParam);
      result = { 
        valid: true, 
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url
        }
      };
    } else {
      result = { valid: true };
    }

    // Cache the result
    validationCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Telegram validation error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
