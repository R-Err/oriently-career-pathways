
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const submissionData: QuizSubmissionRequest = await req.json();
    
    // Insert quiz submission into database
    const { data, error } = await supabase
      .from("quiz_submissions")
      .insert({
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
      })
      .select()
      .single();

    if (error) throw error;

    console.log("Quiz submission saved:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in quiz-submit function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
