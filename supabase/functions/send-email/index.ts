
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("=== SEND EMAIL FUNCTION START ===");
  console.log(`Method: ${req.method}`);
  
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Reading request body...");
    const requestBody = await req.text();
    console.log("Raw request body length:", requestBody.length);
    
    let requestData;
    try {
      requestData = JSON.parse(requestBody);
      console.log("Parsed request data:", JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      throw new Error("Invalid request body format");
    }

    const { email, profile, userInfo } = requestData;
    
    console.log("Extracted data:");
    console.log("- email:", email);
    console.log("- profile:", profile);
    console.log("- userInfo:", userInfo);

    console.log("Getting MailerLite API key...");
    const mailerliteApiKey = Deno.env.get('MAILERLITE_API_KEY');

    if (!mailerliteApiKey) {
      console.error('MailerLite API key not found in environment');
      throw new Error('MailerLite API key not configured');
    }
    console.log("MailerLite API key found:", mailerliteApiKey.substring(0, 10) + "...");

    const emailPayload = {
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
    };

    console.log("Email payload:", JSON.stringify(emailPayload, null, 2));
    console.log("Sending email via MailerLite API...");

    const emailResponse = await fetch('https://connect.mailerlite.com/api/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mailerliteApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    console.log("MailerLite response status:", emailResponse.status);
    console.log("MailerLite response headers:", Object.fromEntries(emailResponse.headers.entries()));

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("MailerLite API error response:", errorText);
      throw new Error(`MailerLite API error: ${emailResponse.status} ${emailResponse.statusText} - ${errorText}`);
    }

    const responseData = await emailResponse.json();
    console.log("MailerLite response data:", JSON.stringify(responseData, null, 2));
    console.log("=== SEND EMAIL FUNCTION SUCCESS ===");

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("=== SEND EMAIL FUNCTION ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("=== END SEND EMAIL ERROR ===");
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        functionName: "send-email"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
