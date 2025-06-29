
export interface QuizAnswer {
  questionId: string;
  answer: string;
  score?: number;
}

export interface ProfileResult {
  id: string;
  title: string;
  description: string;
  courses: string[];
  color: string;
}

export interface QuizSubmission {
  email: string;
  gdprConsent: boolean;
  answers: QuizAnswer[];
  profile: ProfileResult;
  timestamp: string;
}
