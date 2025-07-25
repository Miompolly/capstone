// Auth & Accounts Types
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  role: string;
  education_level: string;
};

export type RegisterResponse = { message: string };

export type LoginPayload = { email: string; password: string };

export type LoginResponse = {
  message: string;
  access: string;
  refresh: string;
  user: User;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  education_level: string;
  is_active: boolean;
  date_registered: string;
};

export type AllUsersResponse = User[];

export type VerifyUserPayload = { user_id: number };
export type VerifyUserResponse = { detail: string };

export type DeleteUserResponse = { detail: string };

export type UpdateUserStatusPayload = {
  user_id: number;
  is_active: boolean;
};
export type UpdateUserStatusResponse = {
  detail: string;
  user: User;
};

// Profile Types
export type ProfilePayload = {
  bio: string;
  skills: string;
  interests: string;
  profile_picture_url: string;
  resume_url: string;
  rating: string;
  sessions_completed: number;
  years_experience: string;
};

export type ProfileResponse = {
  detail: string;
  profile: ProfilePayload;
};

export type UpdateProfilePayload = ProfilePayload;
export type UpdateProfileResponse = ProfileResponse;

// Course Types
export type CoursePayload = {
  title: string;
  category: string;
  description: string;
  certificate_available: boolean;
  level: string;
  price: string;
  duration_weeks: number;
  instructor_name: string;
};

export type Course = Omit<CoursePayload, "instructor_name"> & {
  instructor_name: string;
};

export type CourseResponse = {
  detail: string;
  course: Course & { id: number; posted_by: string };
};

export type AllCoursesResponse = CourseResponse["course"][];
export type CourseByIdResponse = CourseResponse["course"];
export type UpdateCoursePayload = CoursePayload;
export type UpdateCourseResponse = CourseResponse;
export type DeleteCourseResponse = { detail: string };

// Lesson Types
export type LessonPayload = {
  course: number;
  title: string;
  video_url: string;
  duration_minutes: number;
  order: number;
};

export type Lesson = LessonPayload;

export type LessonResponse = {
  detail: string;
  lesson: Lesson & { id: number; course_title: string };
};

export type AllLessonsResponse = LessonResponse["lesson"][];
export type LessonByIdResponse = LessonResponse["lesson"];
export type UpdateLessonPayload = LessonPayload;
export type UpdateLessonResponse = LessonResponse;
export type DeleteLessonResponse = { detail: string };

// Enrollment Types
export type EnrollmentPayload = { course: number };

export type Enrollment = {
  id: number;
  progress: number;
  certificate_earned: boolean;
  enrolled_on: string;
  user: string;
  course: number;
  course_title: string;
};

export type EnrollmentResponse = {
  detail: string;
  enrollment: Enrollment;
};

export type AllEnrollmentsResponse = Enrollment[];
export type DeleteEnrollmentResponse = { detail: string };
export type UpdateEnrollmentPayload = { course: number };
export type UpdateEnrollmentResponse = EnrollmentResponse;

// Lesson Progress Types
export type LessonProgressPayload = {
  enrollment: number;
  lesson: number;
  completed: boolean;
  watched_on: string;
};

export type LessonProgress = {
  id: number;
  completed: boolean;
  watched_on: string;
  enrollment: number;
  lesson: number;
  lesson_name: string;
  course_title: string;
};

export type LessonProgressResponse = {
  detail: string;
  lesson_progress: LessonProgress;
};

export type AllLessonProgressResponse = LessonProgress[];

// Review Types
export type ReviewPayload = {
  rating: number;
  comment: string;
};

export type Review = {
  id: number;
  course: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type ReviewResponse = {
  detail: string;
  review: {
    course: number;
    rating: number;
    comment: string;
  };
};

export type AllReviewsResponse = Review[];
export type ReviewByIdResponse = Review;
export type DeleteReviewResponse = { detail: string };

// Job/Opportunity Types
export interface OpportunityPayload {
  title: string;
  type: string;
  description: string;
  eligibility_criteria: string;
  location: string;
  deadline: string;
  is_active: boolean;
}

export interface Opportunity {
  id: number;
  title: string;
  type: string;
  description: string;
  eligibility_criteria: string;
  location: string;
  deadline: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
}

export interface OpportunityResponse {
  detail: string;
  opportunity: Opportunity;
}

export interface DeleteOpportunityResponse {
  detail: string;
}

export interface ApplicationPayload {
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
}

export interface Application {
  id: number;
  user: string;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
  status: "pending" | "accepted" | "rejected";
  date_applied: string;
  updated_at: string;
  opportunity: number;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  application: Application;
}

// Mentor Types (based on your API response)
export interface Mentor {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  education_level: string;
  profile: any | null;
  title: string;
  experience: string;
  avatar: string;
  sessions: number;
  expertise: string[];
  price: string;
  availability: string[];
}

// Booking Types (based on your API structure)
export interface BookingRequest {
  mentor: number;
  day: string;
  time?: string;
  title?: string;
  note?: string;
}

export interface BookingData {
  mentor: number;
  day: string;
  time: string;
  title: string;
  note: string;
}

export interface BookingResponse {
  message: string;
  booking: BookingData;
}

export interface Booking {
  id: number;
  mentor: string;
  mentee: string;
  mentor_id: number;
  mentee_id: number;
  day: string;
  time: string | null;
  title: string | null;
  note: string | null;
  status: "pending" | "approved" | "denied" | "cancelled";
  created_at: string;
  updated_at: string;
  meeting_batch?: number;
  google_meet_link?: string;
}
