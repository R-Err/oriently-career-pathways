
import { QuizAnswer } from "@/types/quiz";
import { AVAILABLE_COURSES } from "@/data/courses";
import { logOperation } from "./logger";

// Simple AI simulation for MVP - in production, this would call ChatGPT API
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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple logic to determine profile based on answers
    const scores = {
      digital: 0,
      creative: 0,
      analytical: 0,
      business: 0,
      social: 0
    };

    // Calculate scores based on answer patterns
    answers.forEach(answer => {
      const answerValue = answer.answer.toLowerCase();
      if (answerValue.includes('technology') || answerValue.includes('digital')) {
        scores.digital += 2;
      }
      if (answerValue.includes('creative') || answerValue.includes('design')) {
        scores.creative += 2;
      }
      if (answerValue.includes('data') || answerValue.includes('analysis')) {
        scores.analytical += 2;
      }
      if (answerValue.includes('business') || answerValue.includes('leadership')) {
        scores.business += 2;
      }
      if (answerValue.includes('people') || answerValue.includes('team')) {
        scores.social += 2;
      }
    });

    const maxScore = Math.max(...Object.values(scores));
    const dominantType = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) || 'digital';

    const profiles = {
      digital: `Ciao ${firstName}! Sei un innovatore digitale nato. Hai una mentalità aperta verso le nuove tecnologie e ami sperimentare con strumenti digitali all'avanguardia. La tua passione per l'innovazione ti rende perfetto per il mondo tech.`,
      creative: `Ciao ${firstName}! Sei un creativo visionario con un forte senso estetico. Esprimi la tua personalità attraverso il design e la comunicazione visiva, sapendo trasformare idee complesse in soluzioni accattivanti e innovative.`,
      analytical: `Ciao ${firstName}! Sei un analista strategico con una mente metodica. Eccelli nell'interpretazione di dati e nell'identificazione di pattern, prendendo decisioni sempre basate su analisi approfondite e scientifiche.`,
      business: `Ciao ${firstName}! Sei un leader imprenditoriale nato. Hai una visione strategica del business e sai trasformare le idee in opportunità concrete, guidando team verso il successo con determinazione e carisma.`,
      social: `Ciao ${firstName}! Sei un facilitatore sociale con eccellenti capacità interpersonali. Eccelli nella comunicazione e nel lavoro con le persone, creando ambienti collaborativi e supportivi per la crescita di tutti.`
    };

    const courseCategories = {
      digital: ["Corso Full Stack Developer", "Corso UX/UI Design", "Corso Intelligenza Artificiale"],
      creative: ["Corso UX/UI Design", "Corso Graphic Design", "Corso Digital Marketing"],
      analytical: ["Corso Data Analyst", "Corso Cybersecurity", "Corso Intelligenza Artificiale"],
      business: ["Corso Product Management", "Corso Project Management", "Corso Digital Marketing"],
      social: ["Corso Digital Marketing", "Corso Product Management", "Corso Project Management"]
    };

    const profile = profiles[dominantType as keyof typeof profiles];
    const suggestedCourses = courseCategories[dominantType as keyof typeof courseCategories];

    logOperation('AI_CALL_SUCCESS', email, `Profile: ${dominantType}`);

    return {
      profile,
      suggestedCourses
    };
  } catch (error) {
    logOperation('AI_CALL_ERROR', email, `Error: ${error}`);
    throw new Error('Errore nella generazione del profilo');
  }
};
