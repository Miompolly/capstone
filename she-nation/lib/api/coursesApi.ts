import { baseApi } from "./baseApi"
import type {
  CoursePayload,
  CourseResponse,
  AllCoursesResponse,
  CourseByIdResponse,
  UpdateCoursePayload,
  UpdateCourseResponse,
  DeleteCourseResponse,
} from "../types/api"

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
    updateCourse: builder.mutation<UpdateCourseResponse, { id: number; course: UpdateCoursePayload }>({
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
  }),
})

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi
