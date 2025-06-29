
import { supabase } from "@/integrations/supabase/client";
import { QuizSubmission, ProfileResult } from "@/types/quiz";

export const generateAIProfile = async (answers: any[], questions: any[]): Promise<{ profile: string; suggestedCourses: string[] }> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-profile', {
      body: { answers, questions }
    });

    if (error) {
      console.error('Error generating AI profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error calling generate-profile function:', error);
    // Fallback to default profile
    return {
      profile: "Sei una persona con ottime capacità di adattamento e un approccio equilibrato al lavoro. Mostri interesse per la crescita professionale e hai le qualità per eccellere in diversi ambiti lavorativi.",
      suggestedCourses: ["Corso Full Stack Developer", "Corso Digital Marketing", "Corso UX/UI Design"]
    };
  }
};

export const submitQuizToDatabase = async (submission: QuizSubmission): Promise<void> => {
  try {
    const { error } = await supabase
      .from('quiz_submissions')
      .insert({
        first_name: submission.firstName,
        email: submission.email,
        city: submission.city,
        province: submission.province,
        region: submission.region,
        country: submission.country,
        gdpr_consent: submission.gdprConsent,
        answers: submission.answers,
        profile_result: submission.profile,
        suggested_courses: submission.suggestedCourses,
      });

    if (error) {
      console.error('Error submitting to database:', error);
      throw error;
    }

    console.log('Quiz submitted to database successfully');
  } catch (error) {
    console.error('Error in submitQuizToDatabase:', error);
    throw error;
  }
};

export const sendEmailViaAPI = async (email: string, firstName: string, profile: ProfileResult): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { email, firstName, profile }
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);
  } catch (error) {
    console.error('Error calling send-email function:', error);
    throw error;
  }
};
