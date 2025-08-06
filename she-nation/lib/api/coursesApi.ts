import { baseApi } from "./baseApi";
import type {
  CoursePayload,
  CourseResponse,
  AllCoursesResponse,
  CourseByIdResponse,
  UpdateCoursePayload,
  UpdateCourseResponse,
  DeleteCourseResponse,
} from "../types/api";

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<CourseResponse, CoursePayload>({
      query: (course) => ({
        url: "/courses/",
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Course"],
    }),
    getAllCourses: builder.query<AllCoursesResponse, void>({
      query: () => "/courses/",
      providesTags: ["Course"],
    }),
    getCourseById: builder.query<CourseByIdResponse, number>({
      query: (id) => `/courses/${id}/`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),
    updateCourse: builder.mutation<
      UpdateCourseResponse,
      { id: number; course: UpdateCoursePayload }
    >({
      query: ({ id, course }) => ({
        url: `/courses/${id}/`,
        method: "PUT",
        body: course,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Course", id }],
    }),
    deleteCourse: builder.mutation<DeleteCourseResponse, number>({
      query: (id) => ({
        url: `/courses/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    // Enrollment endpoints
    enrollInCourse: builder.mutation<
      {
        id: number;
        course: number;
        user: number;
        status: "pending" | "approved" | "denied";
        enrolled_on: string;
        progress: number;
      },
      number
    >({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll/`,
        method: "POST",
      }),
      invalidatesTags: ["Enrollment", "Course"],
    }),

    getMyEnrollments: builder.query<
      Array<{
        id: number;
        course: {
          id: number;
          title: string;
          description: string;
          instructor: {
            id: number;
            name: string;
            email: string;
          };
          image?: string;
          price: number;
          duration: string;
          level: string;
          certificate_available: boolean;
        };
        status: "pending" | "approved" | "denied";
        enrolled_on: string;
        progress: number;
      }>,
      void
    >({
      query: () => "/courses/my-enrollments/",
      providesTags: ["Enrollment"],
    }),

    updateEnrollmentProgress: builder.mutation<
      {
        id: number;
        progress: number;
      },
      {
        enrollmentId: number;
        progress: number;
      }
    >({
      query: ({ enrollmentId, progress }) => ({
        url: `/courses/enrollments/${enrollmentId}/progress/`,
        method: "PATCH",
        body: { progress },
      }),
      invalidatesTags: ["Enrollment"],
    }),

    // For course owners to manage enrollments
    getCourseEnrollments: builder.query<
      Array<{
        id: number;
        user: {
          id: number;
          name: string;
          email: string;
        };
        status: "pending" | "approved" | "denied";
        enrolled_on: string;
        progress: number;
      }>,
      number
    >({
      query: (courseId) => `/courses/${courseId}/enrollments/`,
      providesTags: ["Enrollment"],
    }),

    updateEnrollmentStatus: builder.mutation<
      {
        id: number;
        status: "pending" | "approved" | "denied";
      },
      {
        enrollmentId: number;
        status: "approved" | "denied";
      }
    >({
      query: ({ enrollmentId, status }) => ({
        url: `/courses/enrollments/${enrollmentId}/status/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Enrollment"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useEnrollInCourseMutation,
  useGetMyEnrollmentsQuery,
  useUpdateEnrollmentProgressMutation,
  useGetCourseEnrollmentsQuery,
  useUpdateEnrollmentStatusMutation,
} = coursesApi;
