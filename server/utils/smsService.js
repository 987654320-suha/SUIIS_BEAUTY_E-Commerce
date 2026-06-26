// E:\scroll-animation\server\util\smsService.js
import axios from "axios";

// Send OTP via SMS
export const sendOTPSMS = async (phoneNumber, otp) => {
  // Clean phone number (remove +91, spaces, dashes, etc.)
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, "").slice(-10);
  
  console.log(`\n📱 Sending SMS to: +91${cleanPhone}`);
  console.log(`🔑 OTP Code: ${otp}`);
  
  // For Fast2SMS (Your current provider)
  if (process.env.SMS_PROVIDER === "fast2sms") {
    try {
      // First try: DLT route (doesn't require website verification)
      console.log("Trying DLT route...");
      const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
        params: {
          authorization: process.env.FAST2SMS_API_KEY,
          route: "dlt",
          sender_id: "SUIISB",
          message: `Your SUIIS Beauty login OTP is ${otp}. Valid for 10 minutes.`,
          language: "english",
          numbers: cleanPhone,
        },
      });
      
      console.log("Fast2SMS Response:", response.data);
      
      if (response.data.return === true) {
        console.log(`✅ SMS sent successfully to +91${cleanPhone}`);
        return { success: true, messageId: response.data.request_id };
      } else {
        // If DLT fails, try Quick API
        console.log("DLT route failed, trying Quick API...");
        const response2 = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
          params: {
            authorization: process.env.FAST2SMS_API_KEY,
            route: "q",
            message: `Your SUIIS Beauty login OTP is ${otp}. Valid for 10 minutes.`,
            language: "english",
            numbers: cleanPhone,
          },
        });
        
        if (response2.data.return === true) {
          console.log(`✅ SMS sent via Quick API to +91${cleanPhone}`);
          return { success: true, messageId: response2.data.request_id };
        } else {
          console.error("❌ Fast2SMS Error:", response2.data.message);
          
          // Provide helpful error message
          if (response2.data.message && response2.data.message.includes("website verification")) {
            console.log("\n⚠️ Website verification required!");
            console.log("To fix this:");
            console.log("1. Go to Fast2SMS Dashboard → OTP Message");
            console.log("2. Complete website verification (add meta tag to your site)");
            console.log("3. Or use DLT API with approved template");
            console.log("\n💡 For now, using development mode (OTP will be shown in console)");
          }
          
          return { success: false, error: response2.data.message, needsVerification: true };
        }
      }
    } catch (error) {
      console.error("❌ Fast2SMS API Error:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      
      // Fallback to development mode
      console.log("\n⚠️ Falling back to development mode...");
      console.log(`📱 OTP for +91${cleanPhone}: ${otp}\n`);
      return { success: true, isDev: true, otp: otp };
    }
  }
  
  // For Twilio (International SMS)
  if (process.env.SMS_PROVIDER === "twilio") {
    try {
      const twilioModule = await import("twilio");
      const twilio = twilioModule.default;
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      
      const message = await client.messages.create({
        body: `Your SUIIS Beauty login OTP is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${cleanPhone}`,
      });
      
      console.log(`✅ SMS sent via Twilio to +91${cleanPhone}, SID: ${message.sid}`);
      return { success: true, messageId: message.sid };
    } catch (error) {
      console.error("❌ Twilio SMS error:", error.message);
      return { success: false, error: error.message };
    }
  }
  
  // For MSG91 (Indian SMS provider)
  if (process.env.SMS_PROVIDER === "msg91") {
    try {
      const response = await axios.post(
        "https://api.msg91.com/api/v5/flow/",
        {
          sender: process.env.MSG91_SENDER_ID || "SUIISB",
          mobiles: `91${cleanPhone}`,
          content: `Your SUIIS Beauty OTP is ${otp}. Valid for 10 minutes. - SUIIS Beauty`,
        },
        {
          headers: {
            authkey: process.env.MSG91_AUTH_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log(`✅ SMS sent via MSG91 to +91${cleanPhone}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ MSG91 SMS error:", error.message);
      return { success: false, error: error.message };
    }
  }
  
  // Development mode fallback - just log to console
  console.log("\n" + "=".repeat(60));
  console.log("📱 SMS (DEVELOPMENT MODE - No SMS Sent)");
  console.log("=".repeat(60));
  console.log(`To: +91${cleanPhone}`);
  console.log(`OTP: ${otp}`);
  console.log("Message: Your SUIIS Beauty login OTP is: " + otp);
  console.log("=".repeat(60) + "\n");
  
  return { success: true, isDev: true, otp: otp };
};

// Send WhatsApp OTP (optional - using Twilio WhatsApp API)
export const sendOTPWhatsApp = async (phoneNumber, otp) => {
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)\+]/g, "").slice(-10);
  
  if (process.env.NODE_ENV === "development" || !process.env.TWILIO_WHATSAPP_NUMBER) {
    console.log(`\n💬 WhatsApp OTP for +91${cleanPhone}: ${otp}\n`);
    return { success: true, isDev: true };
  }
  
  try {
    const twilioModule = await import("twilio");
    const twilio = twilioModule.default;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    const message = await client.messages.create({
      body: `Your SUIIS Beauty login OTP is: ${otp}. Valid for 10 minutes.`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${cleanPhone}`,
    });
    
    console.log(`✅ WhatsApp message sent to +91${cleanPhone}`);
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error("❌ WhatsApp error:", error.message);
    return { success: false, error: error.message };
  }
};

// Verify OTP
export const verifyOTP = (storedOtp, enteredOtp, expiryTime) => {
  if (!storedOtp || !expiryTime) return false;
  if (expiryTime < Date.now()) return false;
  return storedOtp === enteredOtp;
};