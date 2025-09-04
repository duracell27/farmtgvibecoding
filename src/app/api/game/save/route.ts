import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { GameState } from '@/types/game';

export async function POST(request: NextRequest) {
  try {
    const gameState: GameState = await request.json();
    
    console.log('Save API: Received request for user:', gameState.user?.id);
    
    if (!gameState.user?.id) {
      console.log('Save API: No user ID provided');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let db;
    try {
      console.log('Save API: Attempting database connection...');
      const connection = await connectToDatabase();
      db = connection.db;
      console.log('Save API: Database connection successful');
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

    console.log('Save API: Connected to database, saving for user:', gameState.user.id);

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

    console.log('Save API: Save result:', {
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount,
      matchedCount: result.matchedCount,
    });

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
