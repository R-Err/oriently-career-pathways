
import { QuizSubmission } from "@/types/quiz";

export const submitToGoogleSheets = async (submission: QuizSubmission): Promise<void> => {
  // This would normally connect to Google Sheets API
  // For demo purposes, we'll just log the data
  console.log("Submitting to Google Sheets:", submission);
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Data submitted to Google Sheets successfully");
      resolve();
    }, 1000);
  });
};
