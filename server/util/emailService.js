import nodemailer from "nodemailer";

// Create transporter based on email service
const createTransporter = () => {
  // For development - log emails to console instead of sending
  if (process.env.NODE_ENV === "development" && !process.env.EMAIL_USER) {
    console.log("📧 Email service running in DEVELOPMENT mode - emails will be logged to console");
    return {
      sendMail: async (mailOptions) => {
        console.log("\n" + "=".repeat(60));
        console.log("📧 EMAIL (DEVELOPMENT MODE)");
        console.log("=".repeat(60));
        console.log("To:", mailOptions.to);
        console.log("Subject:", mailOptions.subject);
        console.log("Body Preview:", mailOptions.html?.substring(0, 300) + "...");
        console.log("=".repeat(60) + "\n");
        return { messageId: "dev-" + Date.now() };
      }
    };
  }
  
  // For Gmail
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // For Outlook/Hotmail
  if (process.env.EMAIL_SERVICE === "outlook") {
    return nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  
  // Default: console logger for development
  console.log("⚠️ No email service configured. Using console logger.");
  return {
    sendMail: async (mailOptions) => {
      console.log("\n" + "=".repeat(60));
      console.log("📧 EMAIL (NO SERVICE CONFIGURED)");
      console.log("=".repeat(60));
      console.log("To:", mailOptions.to);
      console.log("Subject:", mailOptions.subject);
      console.log("Body Preview:", mailOptions.html?.substring(0, 300) + "...");
      console.log("=".repeat(60) + "\n");
      return { messageId: "mock-" + Date.now() };
    }
  };
};

const transporter = createTransporter();

// Send verification email
export const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email/${verificationToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email - SUIIS Beauty</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; }
        .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #c9a96e; }
        .logo { font-size: 42px; font-weight: 300; color: #c9a96e; }
        .content { background: #141414; padding: 40px 30px; border-radius: 8px; margin: 20px 0; }
        h2 { color: #c9a96e; }
        p { color: #c8c0b8; }
        .button { display: inline-block; padding: 14px 32px; background: #c9a96e; color: #0a0a0a; text-decoration: none; margin: 20px 0; }
        .warning { background: rgba(201, 169, 110, 0.1); padding: 12px; border-left: 3px solid #c9a96e; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SUIIS Beauty</div>
        </div>
        <div class="content">
          <h2>Welcome to SUIIS, ${name}! ✨</h2>
          <p>Thank you for joining the SUIIS Beauty community.</p>
          <p>Please verify your email address to complete your registration.</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <div class="warning">
            <strong>⚠️ This link expires in 24 hours</strong><br>
            If you didn't create an account, please ignore this email.
          </div>
          <p>Or copy this link: ${verificationUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 SUIIS Beauty. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const mailOptions = {
    from: `"SUIIS Beauty" <${process.env.EMAIL_FROM || "noreply@suiisbeauty.com"}>`,
    to: email,
    subject: "Welcome to SUIIS Beauty - Please Verify Your Email",
    html,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendResetPasswordEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reset Your Password - SUIIS Beauty</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; }
        .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #c9a96e; }
        .logo { font-size: 42px; font-weight: 300; color: #c9a96e; }
        .content { background: #141414; padding: 40px 30px; border-radius: 8px; margin: 20px 0; }
        h2 { color: #c9a96e; }
        p { color: #c8c0b8; }
        .button { display: inline-block; padding: 14px 32px; background: #c9a96e; color: #0a0a0a; text-decoration: none; margin: 20px 0; }
        .warning { background: rgba(201, 169, 110, 0.1); padding: 12px; border-left: 3px solid #c9a96e; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SUIIS Beauty</div>
        </div>
        <div class="content">
          <h2>Reset Your Password 🔐</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password.</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <strong>⚠️ This link expires in 1 hour</strong><br>
            If you didn't request this, please ignore this email.
          </div>
          <p>Or copy this link: ${resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 SUIIS Beauty. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const mailOptions = {
    from: `"SUIIS Beauty" <${process.env.EMAIL_FROM || "noreply@suiisbeauty.com"}>`,
    to: email,
    subject: "Reset Your SUIIS Beauty Password",
    html,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Reset email error:", error.message);
    return { success: false, error: error.message };
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Welcome to SUIIS Beauty</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; }
        .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #c9a96e; }
        .logo { font-size: 42px; font-weight: 300; color: #c9a96e; }
        .content { background: #141414; padding: 40px 30px; border-radius: 8px; margin: 20px 0; }
        h2 { color: #c9a96e; }
        p { color: #c8c0b8; }
        .coupon { background: linear-gradient(135deg, #c9a96e 0%, #e8c998 100%); padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .coupon-code { font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #0a0a0a; }
        .button { display: inline-block; padding: 14px 32px; background: #c9a96e; color: #0a0a0a; text-decoration: none; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SUIIS Beauty</div>
        </div>
        <div class="content">
          <h2>Welcome to the Family, ${name}! 🎉</h2>
          <p>Your email has been verified successfully!</p>
          <div class="coupon">
            <p style="color: #0a0a0a;">🎁 Your Welcome Gift</p>
            <div class="coupon-code">WELCOME15</div>
            <p style="color: #0a0a0a;">Get 15% off on your first purchase</p>
          </div>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/shop" class="button">Start Shopping →</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 SUIIS Beauty. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const mailOptions = {
    from: `"SUIIS Beauty" <${process.env.EMAIL_FROM || "noreply@suiisbeauty.com"}>`,
    to: email,
    subject: "Welcome to SUIIS Beauty! ✨ Here's 15% Off",
    html,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Welcome email error:", error.message);
    return { success: false };
  }
};

// Send OTP email
export const sendOTPEmail = async (email, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your OTP - SUIIS Beauty</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #0a0a0a; }
        .container { max-width: 500px; margin: 0 auto; padding: 20px; background: #0a0a0a; color: #c8c0b8; }
        .header { text-align: center; padding: 20px; border-bottom: 2px solid #c9a96e; }
        .logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: #c9a96e; }
        .content { padding: 30px; background: #141414; border-radius: 8px; margin: 20px 0; }
        .otp-code { font-size: 36px; font-weight: bold; text-align: center; padding: 20px; background: #1a1a1a; border-radius: 8px; letter-spacing: 8px; color: #c9a96e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SUIIS Beauty</div>
        </div>
        <div class="content">
          <h2 style="color: #c9a96e; text-align: center;">Your Login OTP 🔐</h2>
          <p>Use the following One-Time Password to log into your account:</p>
          <div class="otp-code">${otp}</div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer" style="text-align: center; padding: 20px; font-size: 12px; color: #807870;">
          <p>&copy; 2024 SUIIS Beauty. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const mailOptions = {
    from: `"SUIIS Beauty" <${process.env.EMAIL_FROM || "noreply@suiisbeauty.com"}>`,
    to: email,
    subject: "Your SUIIS Beauty Login OTP",
    html,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ OTP email error:", error.message);
    return { success: false, error: error.message };
  }
};