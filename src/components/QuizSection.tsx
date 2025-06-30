
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ProfileResult, QuizAnswer } from "@/types/quiz";
import { UserProfile, Course } from "@/types/course";
import { AVAILABLE_COURSES } from "@/data/courses";
import UserInfoForm from "./UserInfoForm";
import { trackEvent } from "@/utils/analytics";

interface QuizSectionProps {
  onQuizComplete: (profile: ProfileResult, email: string, userInfo: UserProfile) => void;
}

const QuizSection = ({ onQuizComplete }: QuizSectionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const questions = [
    {
      id: "interests",
      question: "Cosa ti appassiona di più?",
      options: [
        { value: "technology", label: "Tecnologia e innovazione" },
        { value: "people", label: "Lavorare con le persone" },
        { value: "data", label: "Analisi e dati" },
        { value: "creativity", label: "Creatività e design" }
      ]
    },
    {
      id: "work_style", 
      question: "Come preferisci lavorare?",
      options: [
        { value: "team", label: "In team collaborativi" },
        { value: "independent", label: "In modo indipendente" },
        { value: "leadership", label: "Guidando gli altri" },
        { value: "flexible", label: "Con orari flessibili" }
      ]
    },
    {
      id: "problem_solving",
      question: "Come approcci i problemi?",
      options: [
        { value: "logical", label: "Con logica e metodo" },
        { value: "creative", label: "Con soluzioni creative" },
        { value: "collaborative", label: "Coinvolgendo gli altri" },
        { value: "systematic", label: "Con approccio sistematico" }
      ]
    },
    {
      id: "learning_style",
      question: "Come impari meglio?",
      options: [
        { value: "hands_on", label: "Facendo pratica" },
        { value: "theory", label: "Studiando la teoria" },
        { value: "discussion", label: "Discutendo con altri" },
        { value: "visual", label: "Con esempi visivi" }
      ]
    },
    {
      id: "career_goal",
      question: "Qual è il tuo obiettivo principale?",
      options: [
        { value: "innovation", label: "Innovare e creare" },
        { value: "help_others", label: "Aiutare gli altri" },
        { value: "business_success", label: "Successo negli affari" },
        { value: "expertise", label: "Diventare esperto" }
      ]
    }
  ];

  const handleAnswerChange = (value: string) => {
    const question = questions[currentStep];
    const newAnswer: QuizAnswer = {
      questionId: question.id,
      answer: value
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== question.id);
      return [...filtered, newAnswer];
    });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep + 1); // Move to user info form
    }
  };

  const handleUserInfoSubmit = (userData: UserProfile) => {
    setUserInfo(userData);
    setCurrentStep(currentStep + 1); // Move to email form
  };

  const handleSubmit = async () => {
    if (!email || !gdprConsent || !userInfo) {
      toast({
        title: "Errore",
        description: "Completa tutti i campi richiesti",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate AI profile
      const profileResponse = await fetch('/functions/v1/generate-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          firstName: userInfo.first_name 
        }),
      });

      if (!profileResponse.ok) throw new Error('Failed to generate profile');
      
      const aiResult = await profileResponse.json();
      
      // Map course names to full course objects
      const suggestedCourses = aiResult.courses.map((courseName: string) => 
        AVAILABLE_COURSES.find(course => 
          courseName.includes(course.title) || courseName.includes(course.provider)
        )
      ).filter(Boolean);

      const profile: ProfileResult = {
        id: "ai_generated",
        title: `Profilo per ${userInfo.first_name}`,
        description: aiResult.profile,
        courses: suggestedCourses.map((course: Course) => course.title),
        color: "from-blue-500 to-purple-600"
      };

      // Submit to database
      const submissionResponse = await fetch('/functions/v1/quiz-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: userInfo.first_name,
          email,
          city: userInfo.city,
          province: userInfo.province,
          region: userInfo.region,
          country: userInfo.country,
          gdpr_consent: gdprConsent,
          answers,
          profile_result: profile,
          suggested_courses: suggestedCourses,
        }),
      });

      if (!submissionResponse.ok) throw new Error('Failed to save submission');

      // Track completion
      trackEvent('quiz_complete', {
        profile_type: profile.id,
        email: email,
        city: userInfo.city
      });

      // Send email via MailerLite
      try {
        await fetch('/functions/v1/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, profile, userInfo }),
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't block the flow if email fails
      }

      onQuizComplete(profile, email, userInfo);

      toast({
        title: "Quiz completato!",
        description: "I tuoi risultati sono stati generati",
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
  const isUserInfoForm = currentStep === questions.length;
  const isContactForm = currentStep > questions.length;
  const canProceed = isContactForm ? (email && gdprConsent) : 
                    isUserInfoForm ? false : currentAnswer;

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

        {!isUserInfoForm ? (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle className="text-lg">
                  {isContactForm ? "I tuoi dati" : `Domanda ${currentStep + 1} di ${questions.length}`}
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / (questions.length + 2)) * 100)}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#1E6AE2] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / (questions.length + 2)) * 100}%` }}
                ></div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {!isContactForm ? (
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
                      <label key={option.value} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <span className="cursor-pointer flex-1 select-none">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Inserisci la tua email per ricevere i risultati
                  </h3>
                  
                  <div className="space-y-4">
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
                  {!isContactForm ? (
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
                      {isSubmitting ? "Generazione in corso..." : "Ottieni i risultati"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <UserInfoForm 
            onSubmit={handleUserInfoSubmit}
            onBack={() => setCurrentStep(currentStep - 1)}
          />
        )}
      </div>
    </section>
  );
};

export default QuizSection;
