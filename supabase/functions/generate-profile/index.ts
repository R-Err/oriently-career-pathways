
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== GENERATE PROFILE FUNCTION START ===");
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Reading request body...");
    const requestBody = await req.text();
    console.log("Raw request body:", requestBody);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(requestBody);
      console.log("Parsed request body:", JSON.stringify(parsedBody, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      throw new Error("Invalid request body format");
    }

    const { answers, firstName } = parsedBody;
    
    console.log("Extracted data:");
    console.log("- firstName:", firstName);
    console.log("- answers type:", typeof answers);
    console.log("- answers is array:", Array.isArray(answers));
    console.log("- answers length:", answers?.length);
    console.log("- answers content:", JSON.stringify(answers, null, 2));
    
    // Validate inputs
    if (!firstName || typeof firstName !== 'string') {
      console.error("Invalid firstName:", firstName);
      throw new Error("firstName is required and must be a string");
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      console.error("Invalid answers:", answers);
      throw new Error("answers is required and must be a non-empty array");
    }

    // Validate each answer
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      console.log(`Validating answer ${i}:`, answer);
      
      if (!answer.questionId || !answer.answer) {
        console.error(`Invalid answer at index ${i}:`, answer);
        throw new Error(`Answer at index ${i} is missing questionId or answer`);
      }
    }

    console.log("Getting OpenAI API key...");
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }
    console.log("OpenAI API key found:", openaiApiKey.substring(0, 10) + "...");

    // Convert answers to a readable format for the prompt
    const answersText = answers.map(answer => 
      `${answer.questionId}: ${answer.answer}`
    ).join('\n');

    console.log("Formatted answers for prompt:");
    console.log(answersText);

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

    console.log("Sending request to OpenAI API...");
    console.log("Prompt length:", prompt.length);

    const openaiPayload = {
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a career guidance expert. Respond only with valid JSON format.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    console.log("OpenAI payload:", JSON.stringify(openaiPayload, null, 2));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openaiPayload),
    });

    console.log("OpenAI response status:", response.status);
    console.log("OpenAI response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error response:", errorText);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("OpenAI response data:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Invalid OpenAI response structure:", data);
      throw new Error("Invalid response from OpenAI - missing choices or message");
    }

    const aiResponse = data.choices[0].message.content;
    console.log("AI response content:", aiResponse);

    // Parse the JSON response
    let result;
    try {
      result = JSON.parse(aiResponse);
      console.log("Successfully parsed AI response:", result);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Attempting to extract JSON from response...");
      
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{.*\}/s);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
          console.log("Successfully extracted and parsed JSON:", result);
        } catch (extractError) {
          console.error("Failed to parse extracted JSON:", extractError);
          throw new Error("AI response is not valid JSON format");
        }
      } else {
        console.error("No JSON found in AI response");
        
        // Fallback response
        result = {
          profile: `Ciao ${firstName}! Basandoti sulle tue risposte, sembri essere una persona orientata verso l'innovazione e la tecnologia. Hai un approccio pratico ai problemi e preferisci lavorare in team. Questo profilo ti rende ideale per percorsi formativi nel campo del digitale e della tecnologia.`,
          courses: ["Corso Full Stack Developer", "Corso Digital Marketing", "Corso UX/UI Design"]
        };
        console.log("Using fallback response:", result);
      }
    }

    // Validate result structure
    if (!result.profile || !result.courses || !Array.isArray(result.courses)) {
      console.error("Invalid result structure:", result);
      throw new Error("AI response does not contain required fields");
    }

    console.log("Final result to return:", JSON.stringify(result, null, 2));
    console.log("=== GENERATE PROFILE FUNCTION SUCCESS ===");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("=== GENERATE PROFILE FUNCTION ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("=== END GENERATE PROFILE ERROR ===");
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        functionName: "generate-profile"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
