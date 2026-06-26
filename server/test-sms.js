// E:\scroll-animation\server\test-sms.js
import dotenv from "dotenv";
import { sendOTPSMS } from "./util/smsService.js";

// Load environment variables
dotenv.config();

async function testSMS() {
  console.log("=".repeat(60));
  console.log("Testing Fast2SMS Integration");
  console.log("=".repeat(60));
  
  console.log("\n📋 Configuration Check:");
  console.log("API Key:", process.env.FAST2SMS_API_KEY ? "✓ Found" : "✗ Missing");
  console.log("Provider:", process.env.SMS_PROVIDER || "Not set");
  console.log("Environment:", process.env.NODE_ENV || "development");
  
  if (!process.env.FAST2SMS_API_KEY) {
    console.log("\n❌ ERROR: FAST2SMS_API_KEY not found in .env file");
    console.log("Please add: FAST2SMS_API_KEY=YxKempDdZYTqOaRjSuxOnCTgnnfpeNTGOvxbEmZaK9Ze9dngYOuLjVG29inB");
    return;
  }
  
  // IMPORTANT: Replace with YOUR actual phone number (10 digits)
  const yourPhoneNumber = "9028239890"; // CHANGE THIS to your number!
  
  const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
  
  console.log(`\n📱 Sending OTP: ${testOTP}`);
  console.log(`📞 To: +91${yourPhoneNumber}\n`);
  
  const result = await sendOTPSMS(yourPhoneNumber, testOTP);
  
  console.log("\n📊 Result:");
  console.log("Success:", result.success);
  
  if (result.success) {
    console.log("\n✅ SMS SENT SUCCESSFULLY!");
    console.log("Check your phone for the OTP message.");
    if (result.isDev) {
      console.log("\n⚠️ Note: Running in development mode.");
      console.log("To send real SMS, set NODE_ENV=production in .env");
    }
  } else {
    console.log("\n❌ SMS FAILED!");
    console.log("Error:", result.error);
    console.log("\nTroubleshooting tips:");
    console.log("1. Check your Fast2SMS wallet balance");
    console.log("2. Verify the phone number is correct (10 digits)");
    console.log("3. Make sure the number is not on DND");
    console.log("4. Try using a different phone number");
  }
  
  console.log("\n" + "=".repeat(60));
}

// Run the test
testSMS();