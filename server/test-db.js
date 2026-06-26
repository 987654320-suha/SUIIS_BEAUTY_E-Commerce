// E:\scroll-animation\server\test-db.js
import mongoose from "mongoose";

const uri = "mongodb+srv://suhanisshinde111_db_user:s1u8h1a2n0i4@cluster0.v7wjrpi.mongodb.net/?retryWrites=true&w=majority";

async function test() {
  console.log("Testing MongoDB Atlas Connection...");
  console.log("URI:", uri.replace(/s1u8h1a2n0i4/, "********")); // Hide password in log
  
  try {
    await mongoose.connect(uri);
    console.log("✅ Connected successfully!");
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log("Available databases:", dbs.databases.map(db => db.name));
    
    await mongoose.disconnect();
    console.log("✅ Test completed!");
  } catch (error) {
    console.log("❌ Error:", error.message);
    console.log("\nPossible issues:");
    console.log("1. Check your internet connection");
    console.log("2. Verify username/password");
    console.log("3. Make sure cluster is active (not paused)");
    console.log("4. Try using local MongoDB instead");
  }
}

test();