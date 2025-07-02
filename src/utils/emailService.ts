
import { logOperation } from "./logger";

export interface EmailData {
  firstName: string;
  email: string;
  profile: string;
  suggestedCourses: string[];
  city: string;
  province?: string;
  region?: string;
}

export const sendQuizResultEmail = async (emailData: EmailData): Promise<boolean> => {
  logOperation('EMAIL_SEND_START', emailData.email, 'Starting email send');

  try {
    const response = await fetch('/api/send-quiz-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      logOperation('EMAIL_SEND_ERROR', emailData.email, `Error: ${result.error}`);
      return false;
    }

    logOperation('EMAIL_SEND_SUCCESS', emailData.email, 'Email sent successfully');
    return true;
  } catch (error) {
    logOperation('EMAIL_SEND_ERROR', emailData.email, `Error: ${error}`);
    return false;
  }
};
