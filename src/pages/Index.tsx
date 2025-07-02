
import { useState } from "react";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import QuizSection from "@/components/QuizSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { ProfileResult, UserProfile } from "@/types/quiz";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileResult | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  const handleQuizComplete = (profile: ProfileResult, userProfile: UserProfile) => {
    console.log("Quiz completed:", { profile, userProfile });
    setUserProfile(profile);
    setCurrentUserProfile(userProfile);
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
      {showResults && userProfile && currentUserProfile && (
        <ResultsSection profile={userProfile} userProfile={currentUserProfile} />
      )}
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
