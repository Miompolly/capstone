import { baseApi } from "./baseApi";

// Analytics types
export interface MenteeAnalytics {
  enrolledCourses: number;
  completedCourses: number;
  totalSessions: number;
  completedSessions: Array<{
    id: string;
    mentor: string;
    topic: string;
    date: string;
    time: string;
    rating?: number;
    feedback?: string;
  }>;
  learningProgress: number;
  certificates: number;
  studyHours: number;
  upcomingSessions: Array<{
    id: string;
    mentor: string;
    topic: string;
    time: string;
    date: string;
    meetingLink?: string;
    type: "1-on-1" | "Group";
    status: string;
  }>;
  courseProgress: Array<{
    id: string;
    title: string;
    instructor: string;
    progress: number;
    nextLesson: string;
    dueDate: string;
    thumbnail?: string;
    totalLessons?: number;
    completedLessons?: number;
  }>;
  learningGoals: Array<{
    id: string;
    title: string;
    description?: string;
    progress: number;
    deadline: string;
    priority: "high" | "medium" | "low";
    isCompleted: boolean;
    createdAt: string;
  }>;
  monthlyGrowth: {
    coursesEnrolled: number;
    sessionsCompleted: number;
    goalsCreated: number;
  };
}

export interface MentorAnalytics {
  totalSessions: number;
  totalMentees: number;
  averageRating: number;
  monthlyEarnings: number;
  responseTime: number;
  sessionGrowth: number;
  satisfactionRate: number;
  avgSessionDuration: number;
  upcomingSessions: Array<{
    id: string;
    mentee: string;
    topic: string;
    time: string;
    date: string;
    meetingLink?: string;
  }>;
  coursesCreated: number;
  totalStudents: number;
}

export interface CompanyAnalytics {
  activeJobs: number;
  totalApplications: number;
  profileViews: number;
  hireRate: number;
  jobPostings: Array<{
    id: string;
    title: string;
    applications: number;
    views: number;
    status: "active" | "closed" | "draft";
    postedDate: string;
  }>;
  candidateMetrics: {
    totalCandidates: number;
    qualifiedCandidates: number;
    interviewsScheduled: number;
  };
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Mentee Analytics
    getMenteeAnalytics: builder.query<MenteeAnalytics, void>({
      query: () => "/auth/analytics/mentee/",
      providesTags: ["Analytics"],
    }),

    // Mentor Analytics
    getMentorAnalytics: builder.query<MentorAnalytics, void>({
      query: () => "/auth/analytics/mentor/",
      providesTags: ["Analytics"],
    }),

    // Company Analytics
    getCompanyAnalytics: builder.query<CompanyAnalytics, void>({
      query: () => "/auth/analytics/company/",
      providesTags: ["Analytics"],
    }),

    // General Dashboard Stats
    getDashboardStats: builder.query<
      {
        totalUsers: number;
        activeSessions: number;
        coursesCompleted: number;
        certificatesIssued: number;
      },
      void
    >({
      query: () => "/auth/analytics/dashboard-stats/",
      providesTags: ["Analytics"],
    }),

    // User Progress Analytics
    getUserProgress: builder.query<
      {
        coursesEnrolled: number;
        coursesCompleted: number;
        totalStudyTime: number;
        averageScore: number;
        achievements: Array<{
          id: string;
          title: string;
          description: string;
          earnedDate: string;
          icon: string;
        }>;
      },
      string
    >({
      query: (userId) => `/auth/analytics/user-progress/${userId}/`,
      providesTags: ["Analytics"],
    }),

    // Course Analytics
    getCourseAnalytics: builder.query<
      {
        enrollments: number;
        completions: number;
        averageRating: number;
        revenue: number;
        studentProgress: Array<{
          userId: string;
          userName: string;
          progress: number;
          lastAccessed: string;
        }>;
      },
      string
    >({
      query: (courseId) => `/courses/${courseId}/analytics/`,
      providesTags: ["Analytics"],
    }),

    // Booking Analytics
    getBookingAnalytics: builder.query<
      {
        totalBookings: number;
        completedSessions: number;
        cancelledSessions: number;
        averageRating: number;
        monthlyBookings: Array<{
          month: string;
          count: number;
        }>;
        topMentors: Array<{
          id: string;
          name: string;
          sessionsCount: number;
          rating: number;
        }>;
      },
      void
    >({
      query: () => "/auth/bookings/analytics/",
      providesTags: ["Analytics"],
    }),

    // Learning Goals Management
    getLearningGoals: builder.query<
      Array<{
        id: number;
        title: string;
        description: string;
        progress: number;
        targetDate: string;
        priority: "high" | "medium" | "low";
        isCompleted: boolean;
        createdAt: string;
        updatedAt: string;
      }>,
      void
    >({
      query: () => "/auth/learning-goals/",
      providesTags: ["Analytics"],
    }),

    createLearningGoal: builder.mutation<
      {
        id: number;
        title: string;
        description: string;
        progress: number;
        targetDate: string;
        priority: "high" | "medium" | "low";
        isCompleted: boolean;
        createdAt: string;
      },
      {
        title: string;
        description?: string;
        targetDate: string;
        priority?: "high" | "medium" | "low";
        progress?: number;
      }
    >({
      query: (goalData) => ({
        url: "/auth/learning-goals/",
        method: "POST",
        body: goalData,
      }),
      invalidatesTags: ["Analytics"],
    }),

    updateLearningGoal: builder.mutation<
      {
        id: number;
        title: string;
        description: string;
        progress: number;
        targetDate: string;
        priority: "high" | "medium" | "low";
        isCompleted: boolean;
        updatedAt: string;
      },
      {
        id: number;
        title?: string;
        description?: string;
        targetDate?: string;
        priority?: "high" | "medium" | "low";
        progress?: number;
        isCompleted?: boolean;
      }
    >({
      query: ({ id, ...goalData }) => ({
        url: `/auth/learning-goals/${id}/`,
        method: "PUT",
        body: goalData,
      }),
      invalidatesTags: ["Analytics"],
    }),

    deleteLearningGoal: builder.mutation<{ detail: string }, number>({
      query: (id) => ({
        url: `/auth/learning-goals/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetMenteeAnalyticsQuery,
  useGetMentorAnalyticsQuery,
  useGetCompanyAnalyticsQuery,
  useGetDashboardStatsQuery,
  useGetUserProgressQuery,
  useGetCourseAnalyticsQuery,
  useGetBookingAnalyticsQuery,
  useGetLearningGoalsQuery,
  useCreateLearningGoalMutation,
  useUpdateLearningGoalMutation,
  useDeleteLearningGoalMutation,
} = analyticsApi;
