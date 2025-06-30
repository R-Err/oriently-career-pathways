
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
    const { email, profile, userInfo } = await req.json();
    const mailerliteApiKey = Deno.env.get('MAILERLITE_API_KEY');

    if (!mailerliteApiKey) {
      throw new Error('MailerLite API key not configured');
    }

    // Send email via MailerLite API
    const emailResponse = await fetch('https://connect.mailerlite.com/api/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mailerliteApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: [{ email, name: userInfo.first_name }],
        subject: `I tuoi risultati del quiz di orientamento, ${userInfo.first_name}!`,
        html: `
          <h1>Ciao ${userInfo.first_name}!</h1>
          <p>Ecco i risultati del tuo quiz di orientamento professionale:</p>
          
          <h2>${profile.title}</h2>
          <p>${profile.description}</p>
          
          <h3>Corsi consigliati per te:</h3>
          <ul>
            ${profile.courses.map((course: string) => `<li>${course}</li>`).join('')}
          </ul>
          
          <p>Località: ${userInfo.city}, ${userInfo.province} (${userInfo.region})</p>
          
          <p>Buona fortuna nel tuo percorso professionale!</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`MailerLite API error: ${emailResponse.statusText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
