
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, firstName } = await req.json();
    
    console.log("Received data:", { answers, firstName });
    
    // Validate that answers is an array and has content
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      throw new Error("No answers provided or answers is not a valid array");
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Convert answers to a readable format for the prompt
    const answersText = answers.map(answer => 
      `${answer.questionId}: ${answer.answer}`
    ).join('\n');

    console.log("Formatted answers:", answersText);

    const prompt = `
Basandoti sulle seguenti risposte al quiz di orientamento professionale, genera un profilo personalizzato per ${firstName}:

${answersText}

Rispondi SOLO con un JSON nel seguente formato:
{
  "profile": "Descrizione del profilo professionale in 3-4 frasi (in italiano)",
  "courses": ["Nome corso 1", "Nome corso 2", "Nome corso 3"]
}

I corsi devono essere scelti tra questi disponibili:
- Corso Full Stack Developer
- Corso UX/UI Design  
- Corso Data Analyst
- Corso Web Developer
- Corso Digital Marketing
- Corso Cybersecurity
- Corso Product Management
- Corso Graphic Design
- Corso Intelligenza Artificiale
- Corso Project Management

Rispondi SOLO con il JSON, senza altra formattazione.
`;

    console.log("Sending prompt to OpenAI");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a career guidance expert. Respond only with valid JSON format.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("OpenAI response:", data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from OpenAI");
    }

    const aiResponse = data.choices[0].message.content;
    console.log("AI response content:", aiResponse);

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Fallback response if JSON parsing fails
      result = {
        profile: `Ciao ${firstName}! Basandoti sulle tue risposte, sembri essere una persona orientata verso l'innovazione e la tecnologia. Hai un approccio pratico ai problemi e preferisci lavorare in team. Questo profilo ti rende ideale per percorsi formativi nel campo del digitale e della tecnologia.`,
        courses: ["Corso Full Stack Developer", "Corso Digital Marketing", "Corso UX/UI Design"]
      };
    }

    console.log("Final result:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-profile function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
