import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { RatingType, RatingData, RatingEntry } from '@/types/game';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as RatingType;
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!type || !['level', 'harvests', 'clicks'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid rating type' },
        { status: 400 }
      );
    }

    let db;
    try {
      const connection = await connectToDatabase();
      db = connection.db;
    } catch (dbError) {
      console.error('Rating API: Database connection failed:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    const gameStatesCollection = db.collection('game_states');

    // Build sort criteria based on rating type
    let sortCriteria: Record<string, 1 | -1> = {};
    switch (type) {
      case 'level':
        sortCriteria = { 'gameState.user.level': -1, 'gameState.user.experience': -1 };
        break;
      case 'harvests':
        sortCriteria = { 'gameState.user.totalHarvests': -1 };
        break;
      case 'clicks':
        sortCriteria = { 'gameState.user.totalClicks': -1 };
        break;
    }

    // Get top game states
    const gameStates = await gameStatesCollection
      .find({})
      .sort(sortCriteria)
      .limit(limit)
      .toArray();

    // Create rating entries
    const entries: RatingEntry[] = gameStates.map((gameStateDoc, index) => {
      const user = gameStateDoc.gameState.user;
      let value = 0;
      switch (type) {
        case 'level':
          value = user.level;
          break;
        case 'harvests':
          value = user.totalHarvests || 0;
          break;
        case 'clicks':
          value = user.totalClicks || 0;
          break;
      }

      return {
        user: {
          id: user.id,
          firstName: user.firstName || 'Невідомий',
          lastName: user.lastName,
          username: user.username,
          avatarUrl: user.avatarUrl,
          level: user.level || 1,
          experience: user.experience || 0,
          experienceToNextLevel: user.experienceToNextLevel || 50,
          coins: user.coins || 0,
          emeralds: user.emeralds || 0,
          totalClicks: user.totalClicks || 0,
          totalHarvests: user.totalHarvests || 0,
          totalWaterings: user.totalWaterings || 0,
          totalFertilizers: user.totalFertilizers || 0,
        },
        rank: index + 1,
        value,
      };
    });

    // Get total user count
    const totalUsers = await gameStatesCollection.countDocuments({});

    const ratingData: RatingData = {
      type,
      entries,
      totalUsers,
    };

    return NextResponse.json({
      success: true,
      data: ratingData,
    });
  } catch (error) {
    console.error('Rating API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
