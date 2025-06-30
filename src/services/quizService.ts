
import { QuizSubmission, ProfileResult } from "@/types/quiz";
import { submitQuizToDatabase as submitToSQLite } from "./database";

export const generateAIProfile = async (answers: any[], questions: any[]): Promise<{ profile: string; suggestedCourses: string[] }> => {
  try {
    // For now, we'll use a simple fallback profile generation
    // You can integrate with an AI service later if needed
    return {
      profile: "Sei una persona con ottime capacità di adattamento e un approccio equilibrato al lavoro. Mostri interesse per la crescita professionale e hai le qualità per eccellere in diversi ambiti lavorativi.",
      suggestedCourses: ["Corso Full Stack Developer", "Corso Digital Marketing", "Corso UX/UI Design"]
    };
  } catch (error) {
    console.error('Error generating AI profile:', error);
    return {
      profile: "Sei una persona con ottime capacità di adattamento e un approccio equilibrato al lavoro. Mostri interesse per la crescita professionale e hai le qualità per eccellere in diversi ambiti lavorativi.",
      suggestedCourses: ["Corso Full Stack Developer", "Corso Digital Marketing", "Corso UX/UI Design"]
    };
  }
};

export const submitQuizToDatabase = async (submission: QuizSubmission): Promise<void> => {
  return submitToSQLite(submission);
};

export const sendEmailViaAPI = async (email: string, firstName: string, profile: ProfileResult): Promise<void> => {
  try {
    // For now, we'll just log the email data
    // You can integrate with an email service later
    console.log('Email would be sent to:', email);
    console.log('Profile:', profile);
    console.log('Email sent successfully (simulated)');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
