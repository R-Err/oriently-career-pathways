
import { ProfileResult } from "@/types/quiz";

// This utility is now deprecated - emails are sent via Supabase edge function
export const sendEmailViaMailerlite = async (
  email: string, 
  profile: ProfileResult,
  firstName?: string
): Promise<void> => {
  console.log("Direct MailerLite integration is deprecated. Emails are now sent via Supabase edge function.");
  return Promise.resolve();
};
