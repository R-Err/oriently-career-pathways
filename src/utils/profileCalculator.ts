
import { QuizAnswer, ProfileResult } from "@/types/quiz";

const profiles: ProfileResult[] = [
  {
    id: "digital",
    title: "Innovatore Digitale",
    description: "Sei una persona che ama la tecnologia e l'innovazione. Ti piace sperimentare con nuovi strumenti digitali e trovare soluzioni creative ai problemi tecnologici. Hai una mentalità aperta verso il cambiamento e sei sempre alla ricerca delle ultime tendenze nel mondo tech.",
    courses: [
      "Master in Digital Marketing e Social Media Strategy",
      "Corso di Sviluppo Web Full-Stack (React, Node.js)",
      "Certificazione in Data Science e Machine Learning"
    ],
    color: "from-blue-500 to-purple-600"
  },
  {
    id: "analytical",
    title: "Analista Strategico",
    description: "Hai una mente analitica e metodica che eccelle nell'interpretazione di dati e nell'identificazione di pattern. Ti piace lavorare con numeri e statistiche per prendere decisioni informate. Sei preciso, attento ai dettagli e hai un approccio scientifico ai problemi.",
    courses: [
      "Master in Business Intelligence e Analytics",
      "Corso di Statistica Applicata e R/Python",
      "Certificazione in Project Management (PMP)"
    ],
    color: "from-green-500 to-teal-600"
  },
  {
    id: "creative",
    title: "Creativo Visionario",
    description: "Sei una persona con una forte vena artistica e creativa. Ti esprimi attraverso il design, la comunicazione visiva e l'innovazione estetica. Hai un occhio per i dettagli estetici e sai come comunicare idee complesse attraverso elementi visivi accattivanti.",
    courses: [
      "Master in Graphic Design e User Experience",
      "Corso di Motion Graphics e Video Editing",
      "Workshop di Fotografia Professionale e Post-produzione"
    ],
    color: "from-pink-500 to-orange-500"
  },
  {
    id: "business",
    title: "Leader Imprenditoriale",
    description: "Hai una naturale predisposizione per il business e la leadership. Ti piace guidare team, sviluppare strategie e trasformare idee in opportunità concrete di business. Sei orientato ai risultati e hai una visione strategica del mercato.",
    courses: [
      "MBA Executive in Business Strategy",
      "Corso di Leadership e Team Management",
      "Master in Innovazione e Imprenditorialità"
    ],
    color: "from-indigo-500 to-blue-700"
  },
  {
    id: "social",
    title: "Facilitatore Sociale",
    description: "Sei una persona che eccelle nelle relazioni interpersonali e nella comunicazione. Ti piace lavorare con le persone, aiutarle a crescere e creare ambienti collaborativi. Hai una forte empatia e capacità di ascolto che ti rendono un ottimo mediatore e formatore.",
    courses: [
      "Master in Risorse Umane e Coaching",
      "Corso di Comunicazione Efficace e Public Speaking",
      "Certificazione in Mediazione e Conflict Resolution"
    ],
    color: "from-yellow-500 to-red-500"
  }
];

export const calculateProfile = (answers: QuizAnswer[], questions: any[]): ProfileResult => {
  const scores = {
    digital: 0,
    analytical: 0,
    creative: 0,
    business: 0,
    social: 0
  };

  // Calculate scores based on answers
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const option = question.options.find((opt: any) => opt.value === answer.answer);
      if (option && option.scores) {
        Object.entries(option.scores).forEach(([key, value]) => {
          if (key in scores) {
            scores[key as keyof typeof scores] += value as number;
          }
        });
      }
    }
  });

  // Find the profile with the highest score
  const maxScore = Math.max(...Object.values(scores));
  const winningProfileId = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] || 'digital';
  
  const profile = profiles.find(p => p.id === winningProfileId) || profiles[0];
  
  console.log("Profile calculation:", { scores, winningProfileId, profile });
  
  return profile;
};
