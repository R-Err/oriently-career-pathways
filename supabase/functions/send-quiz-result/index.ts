
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  firstName: string;
  email: string;
  profile: string;
  suggestedCourses: string[];
  city: string;
  province?: string;
  region?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, email, profile, suggestedCourses, city, province, region }: EmailRequest = await req.json();
    
    console.log("Sending email to:", email);

    const locationText = province && region ? `${city}, ${province} - ${region}` : city;

    // Create course list HTML without links
    const courseListHtml = suggestedCourses.map((courseName, index) => `
      <div style="margin: 15px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #1E6AE2;">
        <h4 style="margin: 0 0 8px 0; color: #1E6AE2; font-size: 16px;">${index + 1}. ${courseName}</h4>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Il tuo profilo professionale</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1E6AE2, #7C3AED); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Il tuo profilo professionale</h1>
            <p style="color: white; opacity: 0.9; margin: 10px 0 0 0;">Oriently - Quiz di orientamento</p>
          </div>
          
          <div style="background-color: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 25px;">
            <h2 style="color: #1E6AE2; margin-top: 0;">Ciao ${firstName}! 👋</h2>
            <p style="font-size: 16px; line-height: 1.8;">${profile}</p>
            <div style="margin-top: 15px; padding: 10px; background-color: #f0f7ff; border-radius: 5px;">
              <p style="margin: 0; color: #666; font-size: 14px;">📍 Località: ${locationText}</p>
            </div>
          </div>

          <div style="background-color: #fff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 25px;">
            <h3 style="color: #1E6AE2; margin-top: 0;">Percorsi consigliati per te:</h3>
            ${courseListHtml}
          </div>

          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Questo è il risultato del tuo quiz di orientamento professionale.<br>
              Buona fortuna per il tuo percorso! 🚀
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email via MailerLite
    const mailerLiteResponse = await fetch("https://connect.mailerlite.com/api/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("MAILERLITE_API_KEY")}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        to: [{ email: email, name: firstName }],
        from: { email: "noreply@oriently.it", name: "Oriently Quiz" },
        subject: `${firstName}, ecco il tuo profilo professionale! 🎯`,
        html: htmlContent,
      }),
    });

    if (!mailerLiteResponse.ok) {
      const errorText = await mailerLiteResponse.text();
      console.error("MailerLite error:", mailerLiteResponse.status, errorText);
      throw new Error(`MailerLite API error: ${mailerLiteResponse.status} - ${errorText}`);
    }

    const result = await mailerLiteResponse.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quiz-result function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
