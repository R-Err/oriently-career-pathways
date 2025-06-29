
import { QuizSubmission } from "@/types/quiz";

// This utility is now deprecated - data is stored in Supabase database
export const submitToGoogleSheets = async (submission: QuizSubmission): Promise<void> => {
  console.log("Google Sheets integration is deprecated. Data is now stored in Supabase database.");
  return Promise.resolve();
};
