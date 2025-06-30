
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AVAILABLE_COURSES = [
  "Corso Full Stack Developer (Start2Impact)",
  "Corso UX/UI Design (Start2Impact)", 
  "Corso Data Analyst (Boolean)",
  "Corso Web Developer (Boolean)",
  "Corso Digital Marketing (Talent Garden)",
  "Corso Cybersecurity (Talent Garden)",
  "Corso Product Management (Start2Impact)",
  "Corso Graphic Design (IED)",
  "Corso Intelligenza Artificiale (Talent Garden)",
  "Corso Project Management (Uninettuno)"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, firstName } = await req.json();

    const answersText = answers.map((answer: any, index: number) => 
      `Domanda ${index + 1}: ${answer.answer}`
    ).join('\n');

    const prompt = `Analizza le seguenti risposte del quiz di orientamento professionale e genera:

1. Un profilo professionale personalizzato in italiano (massimo 3-4 frasi)
2. Suggerisci esattamente 3 corsi dalla lista seguente che sono più adatti:

${AVAILABLE_COURSES.join('\n')}

Risposte del quiz:
${answersText}

Nome dell'utente: ${firstName}

Rispondi in formato JSON:
{
  "profile": "Il tuo profilo professionale personalizzato...",
  "courses": ["Corso 1", "Corso 2", "Corso 3"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Sei un consulente di carriera esperto che aiuta le persone a trovare il loro percorso professionale ideale.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-profile function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
