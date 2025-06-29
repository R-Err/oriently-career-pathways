
import { ProfileResult } from "@/types/quiz";

export const sendEmailViaMailerlite = async (email: string, profile: ProfileResult): Promise<void> => {
  // This would normally connect to Mailerlite API
  // For demo purposes, we'll just log the data
  console.log("Sending email via Mailerlite:", { email, profile });
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Email sent successfully via Mailerlite");
      resolve();
    }, 1500);
  });
};
