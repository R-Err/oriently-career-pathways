
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
  province?: string;
  region?: string;
  country?: string;
  email: string;
  gdprConsent: boolean;
  answers: QuizAnswer[];
  profile: ProfileResult;
  suggestedCourses?: Course[];
  timestamp: string;
}

export interface Course {
  title: string;
  provider: string;
  link: string;
}
