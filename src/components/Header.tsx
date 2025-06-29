
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Header = () => {
  const scrollToQuiz = () => {
    const quizElement = document.getElementById("quiz");
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative bg-gradient-to-br from-[#1E6AE2] via-[#2A7FF3] to-[#4D94FF] min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full blur-lg"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center text-white relative z-10">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="32" cy="32" r="30" fill="white" fillOpacity="0.2" />
            <path
              d="M32 16L44 26V48H20V26L32 16Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="32" r="6" fill="#1E6AE2" />
          </svg>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Oriently</h1>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Scopri il percorso formativo ideale per te
        </p>

        {/* CTA Button */}
        <Button
          onClick={scrollToQuiz}
          size="lg"
          className="bg-white text-[#1E6AE2] hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-105"
          style={{ animationDelay: '0.4s' }}
        >
          Inizia il quiz
          <ArrowDown className="ml-2 h-5 w-5" />
        </Button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
