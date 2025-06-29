
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const mailerLiteApiKey = Deno.env.get("MAILERLITE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  firstName: string;
  profile: {
    id: string;
    title: string;
    description: string;
    courses: string[];
    color: string;
  };
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, profile }: EmailRequest = await req.json();

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1E6AE2;">Ciao ${firstName}!</h1>
        <h2 style="color: #333;">Il tuo profilo: ${profile.title}</h2>
        <p style="color: #666; line-height: 1.6;">${profile.description}</p>
        
        <h3 style="color: #333;">Percorsi consigliati per te:</h3>
        <ul style="color: #666; line-height: 1.8;">
          ${profile.courses.map(course => `<li>${course}</li>`).join('')}
        </ul>
        
        <p style="color: #666; margin-top: 30px;">
          Questo è il risultato del tuo quiz di orientamento professionale. 
          Speriamo che ti sia utile per il tuo percorso di crescita!
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 40px;">
          Questa email è stata generata automaticamente dal sistema Oriently.
        </p>
      </div>
    `;

    const emailResponse = await fetch('https://api.mailerlite.com/api/v2/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mailerLiteApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: `${firstName}, ecco il tuo profilo: ${profile.title}`,
        html: emailContent,
        recipients: [{ email }],
        from: {
          email: 'noreply@oriently.com',
          name: 'Oriently'
        }
      }),
    });

    console.log('MailerLite response status:', emailResponse.status);
    
    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('MailerLite error:', errorText);
      throw new Error(`MailerLite API error: ${emailResponse.status}`);
    }

    const result = await emailResponse.json();
    console.log("Email sent successfully via MailerLite:", result);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
