
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
  firstName: string;
  city: string;
  email: string;
  gdprConsent: boolean;
  answers: QuizAnswer[];
  profile: ProfileResult;
  timestamp: string;
}

export interface Course {
  title: string;
  provider: string;
  link: string;
}
