
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  const steps = [
    {
      icon: "📝",
      title: "Rispondi al quiz",
      description: "Completa il nostro questionario di orientamento personalizzato"
    },
    {
      icon: "🎯",
      title: "Ottieni un profilo personalizzato",
      description: "Ricevi un'analisi dettagliata del tuo profilo professionale"
    },
    {
      icon: "🚀",
      title: "Ricevi i percorsi consigliati",
      description: "Scopri i corsi e percorsi formativi più adatti a te"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Come funziona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tre semplici passi per scoprire il tuo futuro professionale
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
