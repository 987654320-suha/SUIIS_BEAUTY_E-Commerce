// test-local.js
import mongoose from "mongoose";

const uri = "mongodb://localhost:27017/suiis";

async function test() {
  console.log("Testing local MongoDB connection...");
  
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to local MongoDB!");
    
    // Test creating a collection
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Existing collections:", collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log("✅ Test completed!");
  } catch (error) {
    console.log("❌ Error:", error.message);
    console.log("\nMake sure MongoDB is running:");
    console.log("Run: 'mongod' in terminal or start MongoDB service");
  }
}

test();