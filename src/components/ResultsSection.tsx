
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileResult, UserProfile } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";
import { logOperation } from "@/utils/logger";
import { sendQuizResultEmail } from "@/utils/emailService";
import { useState } from "react";

interface ResultsSectionProps {
  profile: ProfileResult;
  userProfile: UserProfile;
}

const ResultsSection = ({ profile, userProfile }: ResultsSectionProps) => {
  const { toast } = useToast();
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);

  const handleSendEmail = async () => {
    // If AI profiling failed, don't allow email sending
    if (profile.id === "ai-failed" || profile.courses.length === 0) {
      toast({
        title: "Email non disponibile",
        description: "Non è possibile inviare email quando il profilo non è disponibile",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await sendQuizResultEmail({
        firstName: userProfile.firstName,
        email: userProfile.email,
        profile: profile.description,
        suggestedCourses: profile.courses,
        city: userProfile.city,
        province: userProfile.province,
        region: userProfile.region
      });
      
      if (success) {
        logOperation('EMAIL_RESEND', userProfile.email, 'Profile details resent');
        toast({
          title: "Email inviata!",
          description: "I dettagli sono stati inviati nuovamente alla tua email",
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      logOperation('EMAIL_ERROR', userProfile.email, `Error: ${error}`);
      
      // Disable email functionality temporarily
      setIsEmailDisabled(true);
      toast({
        title: "Servizio email temporaneamente non disponibile",
        description: "Il servizio di invio email è momentaneamente non disponibile. Riprova più tardi.",
        variant: "destructive",
      });
    }
  };

  const isProfileFailed = profile.id === "ai-failed";

  return (
    <section id="results" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ciao {userProfile.firstName}! 👋
          </h2>
          {!isProfileFailed && (
            <p className="text-xl text-gray-600">
              Ecco il tuo profilo personalizzato
            </p>
          )}
        </div>

        <Card className={`shadow-xl border-0 animate-scale-in bg-gradient-to-br ${profile.color}`}>
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="text-3xl">{isProfileFailed ? "⚠️" : "🎯"}</div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2">
              {profile.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed text-lg">
                {profile.description}
              </p>
            </div>

            {/* Only show courses if AI profiling succeeded */}
            {!isProfileFailed && profile.courses.length > 0 && (
              <div className="bg-white bg-opacity-90 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Percorsi consigliati per te:
                </h3>
                <ul className="space-y-4">
                  {profile.courses.map((courseName, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-[#1E6AE2] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{courseName}</h4>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Only show email button if profiling succeeded and email is not disabled */}
            {!isProfileFailed && !isEmailDisabled && (
              <div className="text-center pt-4">
                <Button
                  onClick={handleSendEmail}
                  size="lg"
                  className="bg-white text-[#1E6AE2] hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Ricevi dettagli via e-mail
                </Button>
                <p className="text-white text-sm mt-3 opacity-90">
                  Riceverai una copia di questi risultati all'indirizzo: {userProfile.email}
                </p>
              </div>
            )}

            {/* Show disabled message if email is disabled */}
            {!isProfileFailed && isEmailDisabled && (
              <div className="text-center pt-4">
                <p className="text-white text-sm opacity-75">
                  Servizio email temporaneamente non disponibile
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResultsSection;
