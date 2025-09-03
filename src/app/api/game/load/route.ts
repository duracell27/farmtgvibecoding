import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let db;
    try {
      const connection = await connectToDatabase();
      db = connection.db;
    } catch (dbError) {
      console.error('Load API: Database connection failed:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const collection = db.collection('game_states');

    const gameData = await collection.findOne({ userId });

    if (!gameData) {
      return NextResponse.json({
        success: true,
        gameState: null,
        message: 'No saved game state found',
      });
    }

    return NextResponse.json({
      success: true,
      gameState: gameData.gameState,
      lastUpdated: gameData.lastUpdated,
    });
  } catch (error) {
    console.error('Error loading game state:', error);
    return NextResponse.json(
      { error: 'Failed to load game state' },
      { status: 500 }
    );
  }
}
