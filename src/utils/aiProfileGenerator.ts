
import { QuizAnswer } from "@/types/quiz";
import { logOperation } from "./logger";

export const generateAIProfile = async (
  answers: QuizAnswer[],
  firstName: string,
  email: string
): Promise<{
  profile: string;
  suggestedCourses: string[];
}> => {
  logOperation('AI_CALL_START', email, 'Starting AI profile generation');

  try {
    const response = await fetch('/api/generate-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answers,
        firstName,
        email
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      logOperation('AI_CALL_ERROR', email, `Error: ${result.error}`);
      // Return the fallback data from the error response
      return {
        profile: result.profile,
        suggestedCourses: result.suggestedCourses
      };
    }

    logOperation('AI_CALL_SUCCESS', email, `Profile generated successfully`);

    return {
      profile: result.profile,
      suggestedCourses: result.suggestedCourses
    };
  } catch (error) {
    logOperation('AI_CALL_ERROR', email, `Error: ${error}`);
    
    // Fallback response in case of complete failure
    return {
      profile: `Ciao ${firstName}! Si è verificato un problema nella generazione del profilo, ma dalle tue risposte emerge comunque un profilo interessante con buone capacità di problem solving e adattamento.`,
      suggestedCourses: ["Corso Digital Marketing", "Corso Web Developer", "Corso Project Management"]
    };
  }
};
