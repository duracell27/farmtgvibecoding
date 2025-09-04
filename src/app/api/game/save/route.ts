import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { GameState } from '@/types/game';

export async function POST(request: NextRequest) {
  try {
    const gameState: GameState = await request.json();
    
    
    if (!gameState.user?.id) {
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
      console.error('Save API: Database connection failed:', {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : null,
        environment: process.env.NODE_ENV,
        hasMongoUri: !!process.env.MONGODB_URI,
        hasMongoDb: !!process.env.MONGODB_DB,
      });
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: process.env.NODE_ENV === 'development' ? dbError : 'Check server logs'
        },
        { status: 500 }
      );
    }
    
    const collection = db.collection('game_states');


    // Upsert game state (update if exists, insert if not)
    const result = await collection.updateOne(
      { userId: gameState.user.id },
      {
        $set: {
          userId: gameState.user.id,
          gameState,
          lastUpdated: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );


    return NextResponse.json({
      success: true,
      message: 'Game state saved successfully',
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
    });
  } catch (error) {
    console.error('Error saving game state:', error);
    return NextResponse.json(
      { error: 'Failed to save game state' },
      { status: 500 }
    );
  }
}
