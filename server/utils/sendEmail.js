import { Resend } from "resend";

export const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.RESEND_API_KEY;

  console.log("RESEND_API_KEY:", apiKey);

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing from environment variables.");
  }

  const resend = new Resend(apiKey);

  return await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};