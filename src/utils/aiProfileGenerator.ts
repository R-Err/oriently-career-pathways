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
    
    // Check if we have valid profile data
    if (!result.profile || !result.suggestedCourses || !Array.isArray(result.suggestedCourses)) {
      throw new Error("Invalid response structure from API");
    }

    logOperation('AI_CALL_SUCCESS', email, `Profile generated successfully`);

    return {
      profile: result.profile,
      suggestedCourses: result.suggestedCourses
    };
  } catch (error) {
    logOperation('AI_CALL_ERROR', email, `Error: ${error}`);
    
    // Enhanced fallback response with better logic
    const fallbackProfile = generateLocalFallbackProfile(answers, firstName);
    
    return fallbackProfile;
  }
};

// Local fallback profile generation
const generateLocalFallbackProfile = (answers: QuizAnswer[], firstName: string): {
  profile: string;
  suggestedCourses: string[];
} => {
  // Simple scoring system based on answer patterns
  const scores = {
    technology: 0,
    creative: 0,
    analytical: 0,
    business: 0,
    social: 0
  };

  // Analyze answers to determine profile
  answers.forEach(answer => {
    const answerValue = answer.answer.toLowerCase();
    
    if (answerValue.includes('technology') || answerValue.includes('digital') || answerValue.includes('systematic')) {
      scores.technology += 1;
    }
    if (answerValue.includes('creative') || answerValue.includes('visual') || answerValue.includes('innovation')) {
      scores.creative += 1;
    }
    if (answerValue.includes('data') || answerValue.includes('logical') || answerValue.includes('theory')) {
      scores.analytical += 1;
    }
    if (answerValue.includes('leadership') || answerValue.includes('business') || answerValue.includes('success')) {
      scores.business += 1;
    }
    if (answerValue.includes('people') || answerValue.includes('team') || answerValue.includes('discussion')) {
      scores.social += 1;
    }
  });

  // Determine dominant profile
  const maxScore = Math.max(...Object.values(scores));
  const dominantProfile = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'technology';

  let profile = "";
  let suggestedCourses: string[] = [];

  switch (dominantProfile) {
    case 'technology':
      profile = `Ciao ${firstName}! Dalle tue risposte emerge un forte interesse per la tecnologia e l'innovazione digitale. Hai una mentalità orientata al problem-solving e ti piace lavorare con strumenti tecnologici avanzati. Il tuo profilo è perfetto per ruoli che richiedono competenze tecniche e capacità di adattamento alle nuove tecnologie.`;
      suggestedCourses = ["Corso Full Stack Developer", "Corso Cybersecurity", "Corso Intelligenza Artificiale"];
      break;
    case 'creative':
      profile = `Ciao ${firstName}! Sei una persona con una forte vena creativa e artistica. Ti esprimi attraverso il design e l'innovazione estetica, con un occhio attento ai dettagli visivi. Il tuo profilo è ideale per ruoli che combinano creatività e competenze tecniche nel mondo del design digitale.`;
      suggestedCourses = ["Corso UX/UI Design", "Corso Graphic Design", "Corso Digital Marketing"];
      break;
    case 'analytical':
      profile = `Ciao ${firstName}! Hai una mente analitica e metodica che eccelle nell'interpretazione di dati e nell'identificazione di pattern. Ti piace lavorare con numeri e statistiche per prendere decisioni informate. Il tuo approccio scientifico ai problemi ti rende perfetto per ruoli data-driven.`;
      suggestedCourses = ["Corso Data Analyst", "Corso Intelligenza Artificiale", "Corso Project Management"];
      break;
    case 'business':
      profile = `Ciao ${firstName}! Hai una naturale predisposizione per il business e la leadership. Ti piace guidare progetti, sviluppare strategie e trasformare idee in opportunità concrete. Sei orientato ai risultati e hai una visione strategica del mercato.`;
      suggestedCourses = ["Corso Project Management", "Corso Digital Marketing", "Corso Product Management"];
      break;
    case 'social':
      profile = `Ciao ${firstName}! Eccelli nelle relazioni interpersonali e nella comunicazione. Ti piace lavorare con le persone e creare ambienti collaborativi. La tua forte empatia e capacità di ascolto ti rendono perfetto per ruoli che richiedono interazione e gestione di team.`;
      suggestedCourses = ["Corso Digital Marketing", "Corso Project Management", "Corso UX/UI Design"];
      break;
    default:
      profile = `Ciao ${firstName}! Dalle tue risposte emerge un profilo versatile e bilanciato. Hai mostrato interesse per diversi ambiti e una buona capacità di adattamento. Il tuo approccio equilibrato ti rende adatto a percorsi che combinano diverse competenze.`;
      suggestedCourses = ["Corso Web Developer", "Corso Digital Marketing", "Corso Project Management"];
  }

  return { profile, suggestedCourses };
};