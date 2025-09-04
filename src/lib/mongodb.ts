import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://volodymyrshmidt_db_user:UhhdMBMsJAsUnkO2@cluster0.cs3a9ge.mongodb.net/';
const MONGODB_DB = process.env.MONGODB_DB || 'farm_game';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      // Minimal options for Vercel compatibility
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 15000,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, options).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    }).catch((error) => {
      console.error('MongoDB: Connection with options failed, trying without options:', error);
      
      // Try without options as fallback
      return MongoClient.connect(MONGODB_URI).then((client) => {
        return {
          client,
          db: client.db(MONGODB_DB),
        };
      });
    }).catch((fallbackError) => {
      console.error('MongoDB: Both connection attempts failed:', fallbackError);
      // Clear the promise so we can retry
      cached.promise = null;
      throw fallbackError;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Function to test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.admin().ping();
    return true;
  } catch (error) {
    console.error('MongoDB: Connection test failed:', error);
    return false;
  }
}

// Extend global type for TypeScript
declare global {
  var mongo: {
    conn: { client: MongoClient; db: Db } | null;
    promise: Promise<{ client: MongoClient; db: Db }> | null;
  };
}
