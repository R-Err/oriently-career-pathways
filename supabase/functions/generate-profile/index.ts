import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProfileRequest {
  answers: Array<{
    questionId: string;
    answer: string;
    score?: number;
  }>;
  firstName: string;
  email: string;
}

const availableCourses = [
  "Corso Full Stack Developer",
  "Corso UX/UI Design", 
  "Corso Data Analyst",
  "Corso Web Developer",
  "Corso Digital Marketing",
  "Corso Cybersecurity",
  "Corso Product Management",
  "Corso Graphic Design",
  "Corso Intelligenza Artificiale",
  "Corso Project Management"
];

// Fallback function to generate profile based on answers
const generateFallbackProfile = (answers: any[], firstName: string): { profile: string; suggestedCourses: string[] } => {
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, firstName, email }: ProfileRequest = await req.json();
    
    console.log("Generating AI profile for:", email);

    // Check if OpenAI API key is available
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!openaiApiKey) {
      console.log("OpenAI API key not found, using fallback profile generation");
      const fallbackResult = generateFallbackProfile(answers, firstName);
      
      return new Response(JSON.stringify(fallbackResult), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Create prompt for ChatGPT
    const answersText = answers.map(a => `${a.questionId}: ${a.answer}`).join('\n');
    const coursesText = availableCourses.join(', ');
    
    const prompt = `Analizza le seguenti risposte di un quiz di orientamento professionale e genera un profilo personalizzato per ${firstName}:

Risposte del quiz:
${answersText}

Corsi disponibili: ${coursesText}

Restituisci SOLO un oggetto JSON con questa struttura esatta:
{
  "profile": "Una descrizione personalizzata in italiano di 3-4 frasi che inizia con 'Ciao ${firstName}!' e descrive il profilo professionale della persona",
  "suggestedCourses": ["Nome Corso 1", "Nome Corso 2", "Nome Corso 3"]
}

I corsi suggeriti devono essere ESATTAMENTE 3 e presi dalla lista fornita. La descrizione deve essere motivante e specifica per le risposte date.`;

    try {
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // Using the more cost-effective model
          messages: [
            {
              role: "system",
              content: "Sei un esperto di orientamento professionale. Rispondi SEMPRE e SOLO con un oggetto JSON valido, senza testo aggiuntivo."
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error(`OpenAI API error: ${openaiResponse.status} - ${errorText}`);
        throw new Error(`OpenAI API error: ${openaiResponse.status}`);
      }

      const openaiData = await openaiResponse.json();
      
      if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
        throw new Error("Invalid OpenAI response structure");
      }
      
      const aiResponse = openaiData.choices[0].message.content;
      
      console.log("Raw AI response:", aiResponse);
      
      // Parse the JSON response
      let result;
      try {
        // Clean the response in case there's extra text
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
        result = JSON.parse(jsonString);
        
        // Validate the result structure
        if (!result.profile || !result.suggestedCourses || !Array.isArray(result.suggestedCourses)) {
          throw new Error("Invalid AI response structure");
        }
        
        // Ensure we have exactly 3 courses
        if (result.suggestedCourses.length !== 3) {
          result.suggestedCourses = result.suggestedCourses.slice(0, 3);
          if (result.suggestedCourses.length < 3) {
            // Fill with default courses if needed
            const defaultCourses = ["Corso Digital Marketing", "Corso Web Developer", "Corso Project Management"];
            while (result.suggestedCourses.length < 3) {
              const courseToAdd = defaultCourses.find(course => !result.suggestedCourses.includes(course));
              if (courseToAdd) {
                result.suggestedCourses.push(courseToAdd);
              } else {
                break;
              }
            }
          }
        }
        
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        throw parseError;
      }

      console.log("Generated profile for:", email, "Result:", result);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
      
    } catch (openaiError) {
      console.error("OpenAI API call failed:", openaiError);
      // Fall back to rule-based generation
      const fallbackResult = generateFallbackProfile(answers, firstName);
      
      return new Response(JSON.stringify(fallbackResult), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

  } catch (error: any) {
    console.error("Error in generate-profile function:", error);
    
    // Always provide a fallback response
    const fallbackResult = {
      profile: `Ciao! Si è verificato un errore nella generazione del profilo, ma dalle tue risposte emerge comunque un profilo interessante con buone capacità di problem solving.`,
      suggestedCourses: ["Corso Digital Marketing", "Corso Web Developer", "Corso Project Management"]
    };
    
    return new Response(JSON.stringify(fallbackResult), {
      status: 200, // Return 200 instead of 500 to avoid triggering error handling
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);