
import { QuizAnswer, ProfileResult } from "@/types/quiz";
import { logOperation } from "./logger";

export interface QuizSubmission {
  id: string;
  firstName: string;
  email: string;
  city: string;
  province?: string;
  region?: string;
  country: string;
  gdprConsent: boolean;
  answers: QuizAnswer[];
  profileResult: ProfileResult;
  suggestedCourses: string[];
  timestamp: string;
}

export const saveQuizSubmission = (submission: Omit<QuizSubmission, 'id' | 'timestamp'>): QuizSubmission => {
  const fullSubmission: QuizSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  };

  // Save to localStorage
  const existingSubmissions = JSON.parse(localStorage.getItem('quiz-submissions') || '[]');
  existingSubmissions.push(fullSubmission);
  localStorage.setItem('quiz-submissions', JSON.stringify(existingSubmissions));

  logOperation('QUIZ_SUBMIT', submission.email, 'Submission saved successfully');

  return fullSubmission;
};

export const getAllSubmissions = (): QuizSubmission[] => {
  return JSON.parse(localStorage.getItem('quiz-submissions') || '[]');
};

export const exportSubmissionsCSV = (): string => {
  const submissions = getAllSubmissions();
  const csvHeader = 'ID,Nome,Email,Città,Provincia,Regione,Paese,Consenso GDPR,Profilo,Corsi Suggeriti,Data\n';
  const csvRows = submissions.map(sub => 
    `${sub.id},"${sub.firstName}","${sub.email}","${sub.city}","${sub.province || ''}","${sub.region || ''}","${sub.country}",${sub.gdprConsent},"${sub.profileResult.title}","${sub.suggestedCourses.join('; ')}","${sub.timestamp}"`
  ).join('\n');
  
  return csvHeader + csvRows;
};
