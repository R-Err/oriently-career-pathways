
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import QuizSection from "@/components/QuizSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { ProfileResult } from "@/types/quiz";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileResult | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const handleQuizComplete = (profile: ProfileResult, email: string) => {
    console.log("Quiz completed:", { profile, email });
    setUserProfile(profile);
    setUserEmail(email);
    setShowResults(true);
    
    // Scroll to results section
    setTimeout(() => {
      const resultsElement = document.getElementById("results");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HowItWorks />
      <QuizSection onQuizComplete={handleQuizComplete} />
      {showResults && userProfile && (
        <ResultsSection profile={userProfile} email={userEmail} />
      )}
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
