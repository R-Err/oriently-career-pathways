
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, firstName, email }: ProfileRequest = await req.json();
    
    console.log("Generating AI profile for:", email);

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

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
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
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0].message.content;
    
    console.log("Raw AI response:", aiResponse);
    
    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback response
      result = {
        profile: `Ciao ${firstName}! Dalle tue risposte emerge un profilo interessante e versatile. Hai mostrato curiosità verso diversi ambiti e una buona capacità di adattamento. Il tuo approccio equilibrato ti rende adatto a percorsi che combinano creatività e competenze tecniche.`,
        suggestedCourses: ["Corso Digital Marketing", "Corso UX/UI Design", "Corso Project Management"]
      };
    }

    console.log("Generated profile for:", email, "Result:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in generate-profile function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        profile: `Ciao! Si è verificato un errore nella generazione del profilo, ma dalle tue risposte emerge comunque un profilo interessante con buone capacità di problem solving.`,
        suggestedCourses: ["Corso Digital Marketing", "Corso Web Developer", "Corso Project Management"]
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
