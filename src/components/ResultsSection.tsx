
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileResult } from "@/types/quiz";
import { UserProfile } from "@/types/course";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/utils/analytics";

interface ResultsSectionProps {
  profile: ProfileResult;
  email: string;
  userInfo: UserProfile;
}

const ResultsSection = ({ profile, email, userInfo }: ResultsSectionProps) => {
  const { toast } = useToast();

  const handleSendEmail = async () => {
    try {
      await fetch('https://evynyovnjoauudinlmid.supabase.co/functions/v1/send-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eW55b3Zuam9hdXVkaW5sbWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTE0ODIsImV4cCI6MjA2Njc2NzQ4Mn0.61sV7-oOqD60lOy_fwoH7uhKlF3QMll_y_vVKAPcIt8`
        },
        body: JSON.stringify({ email, profile, userInfo }),
      });
      
      trackEvent('email_resend', { profile_type: profile.id });
      
      toast({
        title: "Email inviata!",
        description: "I dettagli sono stati inviati nuovamente alla tua email",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Errore",
        description: "Errore nell'invio dell'email. Riprova più tardi.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="results" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ciao {userInfo.first_name}! Ecco il tuo profilo personalizzato
          </h2>
          <p className="text-xl text-gray-600">
            Basato sulle tue risposte e generato con intelligenza artificiale
          </p>
        </div>

        <Card className={`shadow-xl border-0 animate-scale-in bg-gradient-to-br ${profile.color}`}>
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="text-3xl">🎯</div>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-2">
              {profile.title}
            </CardTitle>
            <p className="text-white text-opacity-90">
              {userInfo.city}, {userInfo.province} - {userInfo.region}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed text-lg">
                {profile.description}
              </p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Percorsi consigliati per te:
              </h3>
              <ul className="space-y-3">
                {profile.courses.map((course, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#1E6AE2] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-800 leading-relaxed">{course}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={handleSendEmail}
                size="lg"
                className="bg-white text-[#1E6AE2] hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Ricevi dettagli via e-mail
              </Button>
              <p className="text-white text-sm mt-3 opacity-90">
                Riceverai una copia di questi risultati all'indirizzo: {email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResultsSection;
