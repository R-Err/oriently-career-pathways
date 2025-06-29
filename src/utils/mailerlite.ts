
import { ProfileResult } from "@/types/quiz";

export const sendEmailViaMailerlite = async (
  email: string, 
  profile: ProfileResult,
  firstName?: string
): Promise<void> => {
  // This would normally connect to Mailerlite API
  // For demo purposes, we'll just log the data
  console.log("Sending email via Mailerlite:", { 
    email, 
    profile, 
    firstName: firstName || "Utente" 
  });
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Email sent successfully via Mailerlite");
      resolve();
    }, 1500);
  });
};
