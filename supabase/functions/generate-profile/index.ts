
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const availableCourses = [
  { title: "Corso Full Stack Developer", provider: "Start2Impact", link: "https://www.start2impact.it/corsi/full-stack-developer" },
  { title: "Corso UX/UI Design", provider: "Start2Impact", link: "https://www.start2impact.it/corsi/ux-ui-design" },
  { title: "Corso Data Analyst", provider: "Boolean", link: "https://www.boolean.careers/corso-data-analyst" },
  { title: "Corso Web Developer", provider: "Boolean", link: "https://www.boolean.careers/corso-web-developer" },
  { title: "Corso Digital Marketing", provider: "Talent Garden", link: "https://talentgarden.org/it/corsi/digital-marketing/" },
  { title: "Corso Cybersecurity", provider: "Talent Garden", link: "https://talentgarden.org/it/corsi/cybersecurity/" },
  { title: "Corso Product Management", provider: "Start2Impact", link: "https://www.start2impact.it/corsi/product-management" },
  { title: "Corso Graphic Design", provider: "IED", link: "https://www.ied.it/corsi/grafica" },
  { title: "Corso Intelligenza Artificiale", provider: "Talent Garden", link: "https://talentgarden.org/it/corsi/intelligenza-artificiale/" },
  { title: "Corso Project Management", provider: "Uninettuno", link: "https://www.uninettunouniversity.net/it/corso.aspx?id=370" }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers, questions } = await req.json();

    const courseList = availableCourses.map(course => `${course.title} (${course.provider})`).join(', ');
    
    const prompt = `Sei un esperto di orientamento professionale. Basandoti sulle seguenti risposte a un quiz di orientamento, genera un profilo personalizzato e suggerisci 3 corsi.

Domande e risposte del quiz:
${questions.map((q: any, i: number) => {
  const answer = answers.find((a: any) => a.questionId === q.id);
  const selectedOption = q.options.find((opt: any) => opt.value === answer?.answer);
  return `${i + 1}. ${q.question}\nRisposta: ${selectedOption?.label || 'Non specificata'}`;
}).join('\n\n')}

Corsi disponibili: ${courseList}

Genera:
1. Un profilo personalizzato di 3-4 frasi in italiano che descriva la personalità professionale dell'utente
2. Suggerisci esattamente 3 corsi dalla lista disponibile che meglio si adattano al profilo

Rispondi in formato JSON:
{
  "profile": "Descrizione del profilo...",
  "suggestedCourses": ["Nome corso 1", "Nome corso 2", "Nome corso 3"]
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
          { role: 'system', content: 'Sei un esperto consulente di orientamento professionale. Rispondi sempre in italiano e in formato JSON valido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    try {
      const parsedResponse = JSON.parse(aiResponse);
      return new Response(JSON.stringify(parsedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback response
      return new Response(JSON.stringify({
        profile: "Sei una persona con ottime capacità di adattamento e un approccio equilibrato al lavoro. Mostri interesse per la crescita professionale e hai le qualità per eccellere in diversi ambiti lavorativi.",
        suggestedCourses: ["Corso Full Stack Developer", "Corso Digital Marketing", "Corso UX/UI Design"]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-profile function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
