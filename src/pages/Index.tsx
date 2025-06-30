
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import QuizSection from "@/components/QuizSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { ProfileResult } from "@/types/quiz";
import { UserProfile } from "@/types/course";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileResult | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);

  const handleQuizComplete = (profile: ProfileResult, email: string, userData: UserProfile) => {
    console.log("Quiz completed:", { profile, email, userData });
    setUserProfile(profile);
    setUserEmail(email);
    setUserInfo(userData);
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
      {showResults && userProfile && userInfo && (
        <ResultsSection 
          profile={userProfile} 
          email={userEmail}
          userInfo={userInfo}
        />
      )}
      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
