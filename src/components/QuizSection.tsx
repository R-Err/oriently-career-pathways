
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ProfileResult, QuizAnswer } from "@/types/quiz";
import { calculateProfile } from "@/utils/profileCalculator";
import { submitToGoogleSheets } from "@/utils/googleSheets";
import { sendEmailViaMailerlite } from "@/utils/mailerlite";
import { trackEvent } from "@/utils/analytics";

interface QuizSectionProps {
  onQuizComplete: (profile: ProfileResult, email: string) => void;
}

const QuizSection = ({ onQuizComplete }: QuizSectionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const questions = [
    {
      id: "interests",
      question: "Cosa ti appassiona di più?",
      options: [
        { value: "technology", label: "Tecnologia e innovazione", scores: { digital: 3, creative: 1, analytical: 2, business: 1, social: 0 } },
        { value: "people", label: "Lavorare con le persone", scores: { social: 3, business: 2, creative: 1, digital: 0, analytical: 0 } },
        { value: "data", label: "Analisi e dati", scores: { analytical: 3, digital: 2, business: 1, creative: 0, social: 0 } },
        { value: "creativity", label: "Creatività e design", scores: { creative: 3, digital: 1, social: 1, analytical: 0, business: 1 } }
      ]
    },
    {
      id: "work_style",
      question: "Come preferisci lavorare?",
      options: [
        { value: "team", label: "In team collaborativi", scores: { social: 2, business: 2, creative: 1, digital: 1, analytical: 0 } },
        { value: "independent", label: "In modo indipendente", scores: { analytical: 2, digital: 2, creative: 2, business: 1, social: 0 } },
        { value: "leadership", label: "Guidando gli altri", scores: { business: 3, social: 2, digital: 0, creative: 1, analytical: 1 } },
        { value: "flexible", label: "Con orari flessibili", scores: { creative: 2, digital: 2, analytical: 1, business: 1, social: 1 } }
      ]
    },
    {
      id: "problem_solving",
      question: "Come approcci i problemi?",
      options: [
        { value: "logical", label: "Con logica e metodo", scores: { analytical: 3, digital: 1, business: 1, creative: 0, social: 0 } },
        { value: "creative", label: "Con soluzioni creative", scores: { creative: 3, digital: 1, social: 1, analytical: 0, business: 1 } },
        { value: "collaborative", label: "Coinvolgendo gli altri", scores: { social: 3, business: 1, creative: 1, digital: 0, analytical: 1 } },
        { value: "systematic", label: "Con approccio sistematico", scores: { digital: 2, analytical: 2, business: 1, creative: 0, social: 0 } }
      ]
    },
    {
      id: "learning_style",
      question: "Come impari meglio?",
      options: [
        { value: "hands_on", label: "Facendo pratica", scores: { digital: 2, creative: 2, analytical: 1, business: 1, social: 1 } },
        { value: "theory", label: "Studiando la teoria", scores: { analytical: 3, digital: 1, business: 1, creative: 0, social: 0 } },
        { value: "discussion", label: "Discutendo con altri", scores: { social: 3, business: 1, creative: 1, digital: 0, analytical: 1 } },
        { value: "visual", label: "Con esempi visivi", scores: { creative: 3, digital: 1, analytical: 1, business: 1, social: 0 } }
      ]
    },
    {
      id: "career_goal",
      question: "Qual è il tuo obiettivo principale?",
      options: [
        { value: "innovation", label: "Innovare e creare", scores: { creative: 2, digital: 2, analytical: 1, business: 1, social: 0 } },
        { value: "help_others", label: "Aiutare gli altri", scores: { social: 3, business: 1, creative: 1, digital: 0, analytical: 0 } },
        { value: "business_success", label: "Successo negli affari", scores: { business: 3, analytical: 1, digital: 1, creative: 0, social: 1 } },
        { value: "expertise", label: "Diventare esperto", scores: { analytical: 2, digital: 2, creative: 1, business: 1, social: 0 } }
      ]
    }
  ];

  const handleAnswerChange = (value: string) => {
    const question = questions[currentStep];
    const selectedOption = question.options.find(opt => opt.value === value);
    
    if (selectedOption) {
      const newAnswer: QuizAnswer = {
        questionId: question.id,
        answer: value,
        score: Object.values(selectedOption.scores).reduce((a, b) => a + b, 0)
      };

      setAnswers(prev => {
        const filtered = prev.filter(a => a.questionId !== question.id);
        return [...filtered, newAnswer];
      });
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1); // Move to user info form
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !city || !email || !gdprConsent) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi richiesti e accetta il consenso GDPR",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate profile
      const profile = calculateProfile(answers, questions);
      
      // Track completion
      trackEvent('quiz_complete', {
        profile_type: profile.id,
        email: email,
        firstName: firstName,
        city: city
      });

      // Submit to Google Sheets (with additional user data)
      await submitToGoogleSheets({
        firstName,
        city,
        email,
        gdprConsent,
        answers,
        profile,
        timestamp: new Date().toISOString()
      });

      // Send email
      await sendEmailViaMailerlite(email, profile, firstName);

      // Show results
      onQuizComplete(profile, email);

      toast({
        title: "Quiz completato!",
        description: "I tuoi risultati sono stati inviati via email",
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAnswer = answers.find(a => a.questionId === questions[currentStep]?.id);
  const isUserInfoForm = currentStep >= questions.length;
  const canProceed = isUserInfoForm ? (firstName && city && email && gdprConsent) : currentAnswer;

  return (
    <section id="quiz" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quiz di Orientamento
          </h2>
          <p className="text-xl text-gray-600">
            Scopri il tuo profilo professionale ideale
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-lg">
                {isUserInfoForm ? "I tuoi dati" : `Domanda ${currentStep + 1} di ${questions.length}`}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / (questions.length + 1)) * 100)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#1E6AE2] h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / (questions.length + 1)) * 100}%` }}
              ></div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isUserInfoForm ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900">
                  {questions[currentStep].question}
                </h3>
                
                <RadioGroup
                  value={currentAnswer?.answer || ""}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  {questions[currentStep].options.map((option) => (
                    <Label 
                      key={option.value} 
                      htmlFor={option.value} 
                      className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1 text-gray-800">
                        {option.label}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Inserisci i tuoi dati per ricevere i risultati
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">Come possiamo chiamarti? *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Il tuo nome"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">In quale città vivi? *</Label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="La tua città"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="la-tua-email@esempio.com"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="gdpr"
                      checked={gdprConsent}
                      onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                    />
                    <Label htmlFor="gdpr" className="text-sm leading-relaxed cursor-pointer">
                      Acconsento all'uso dei miei dati per ricevere il risultato del quiz e comunicazioni relative ai percorsi formativi (GDPR) *
                    </Label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isSubmitting}
                >
                  Indietro
                </Button>
              )}
              
              <div className="ml-auto">
                {!isUserInfoForm ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="bg-[#1E6AE2] hover:bg-[#1557C7]"
                  >
                    {currentStep === questions.length - 1 ? "Continua" : "Avanti"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed || isSubmitting}
                    className="bg-[#1E6AE2] hover:bg-[#1557C7]"
                  >
                    {isSubmitting ? "Invio in corso..." : "Ottieni i risultati"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuizSection;
