
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    
    // Initialize GA4 after consent
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted"
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Card className="shadow-2xl border-0 max-w-md mx-auto">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Cookie Policy</h3>
          <p className="text-sm text-gray-600 mb-4">
            Utilizziamo cookie per migliorare la tua esperienza e analizzare il traffico. 
            Accettando, acconsenti all'uso dei cookie per analytics.
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={handleAccept}
              size="sm"
              className="bg-[#1E6AE2] hover:bg-[#1557C7] flex-1"
            >
              Accetta
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Rifiuta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieBanner;
