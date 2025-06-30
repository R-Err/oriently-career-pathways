
export interface Course {
  title: string;
  provider: string;
  link: string;
}

export interface UserProfile {
  first_name: string;
  city: string;
  province: string;
  region: string;
  country: string;
}

export interface QuizSubmissionData {
  id?: string;
  first_name: string;
  email: string;
  city: string;
  province: string;
  region: string;
  country: string;
  gdpr_consent: boolean;
  answers: any[];
  profile_result: any;
  suggested_courses: Course[];
  timestamp: string;
}
