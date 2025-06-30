
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuizSubmissionRequest {
  first_name: string;
  email: string;
  city: string;
  province: string;
  region: string;
  country: string;
  gdpr_consent: boolean;
  answers: any[];
  profile_result: any;
  suggested_courses: any[];
}

serve(async (req) => {
  console.log("=== QUIZ SUBMIT FUNCTION START ===");
  console.log(`Method: ${req.method}`);
  
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Reading request body...");
    const requestBody = await req.text();
    console.log("Raw request body length:", requestBody.length);
    
    let submissionData: QuizSubmissionRequest;
    try {
      submissionData = JSON.parse(requestBody);
      console.log("Parsed submission data keys:", Object.keys(submissionData));
      console.log("Submission data:", JSON.stringify(submissionData, null, 2));
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      throw new Error("Invalid request body format");
    }

    console.log("Getting Supabase environment variables...");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      console.log("SUPABASE_URL present:", !!supabaseUrl);
      console.log("SUPABASE_SERVICE_ROLE_KEY present:", !!supabaseServiceKey);
      throw new Error("Supabase configuration not found");
    }

    console.log("Creating Supabase client...");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log("Inserting data into quiz_submissions table...");
    const insertData = {
      first_name: submissionData.first_name,
      email: submissionData.email,
      city: submissionData.city,
      province: submissionData.province,
      region: submissionData.region,
      country: submissionData.country,
      gdpr_consent: submissionData.gdpr_consent,
      answers: submissionData.answers,
      profile_result: submissionData.profile_result,
      suggested_courses: submissionData.suggested_courses,
    };
    
    console.log("Data to insert:", JSON.stringify(insertData, null, 2));

    const { data, error } = await supabase
      .from("quiz_submissions")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    console.log("Quiz submission saved successfully:", data);
    console.log("=== QUIZ SUBMIT FUNCTION SUCCESS ===");

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("=== QUIZ SUBMIT FUNCTION ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("=== END QUIZ SUBMIT ERROR ===");
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString(),
        functionName: "quiz-submit"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
