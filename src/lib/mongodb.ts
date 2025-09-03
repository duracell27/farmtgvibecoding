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
      // Connection options for Vercel compatibility
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      // SSL options for Vercel
      ssl: true,
      sslValidate: false,
      // Retry options
      retryWrites: true,
      retryReads: true,
      // Connection timeout
      connectTimeoutMS: 10000,
      // Heartbeat frequency
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, options).then((client) => {
      console.log('MongoDB: Connected successfully');
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    }).catch((error) => {
      console.error('MongoDB: Connection failed:', error);
      // Clear the promise so we can retry
      cached.promise = null;
      throw error;
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
    console.log('MongoDB: Connection test successful');
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
