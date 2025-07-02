
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

export interface UserProfile {
  firstName: string;
  email: string;
  city: string;
  province?: string;
  region?: string;
  country?: string;
}

export interface QuizSubmission {
  userProfile: UserProfile;
  gdprConsent: boolean;
  answers: QuizAnswer[];
  profileResult: ProfileResult;
  timestamp: string;
}
