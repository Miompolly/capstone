import { baseApi } from "./baseApi"
import type {
  LessonPayload,
  LessonResponse,
  AllLessonsResponse,
  LessonByIdResponse,
  UpdateLessonPayload,
  UpdateLessonResponse,
  DeleteLessonResponse,
} from "../types/api"

export const lessonsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLesson: builder.mutation<LessonResponse, LessonPayload>({
      query: (lesson) => ({
        url: "/courses/lessons/",
        method: "POST",
        body: lesson,
      }),
      invalidatesTags: ["Lesson"],
    }),
    getAllLessons: builder.query<AllLessonsResponse, void>({
      query: () => "/courses/lessons/",
      providesTags: ["Lesson"],
    }),
    getLessonById: builder.query<LessonByIdResponse, number>({
      query: (id) => `/courses/lessons/${id}/`,
      providesTags: (result, error, id) => [{ type: "Lesson", id }],
    }),
    updateLesson: builder.mutation<UpdateLessonResponse, { id: number; lesson: UpdateLessonPayload }>({
      query: ({ id, lesson }) => ({
        url: `/courses/lessons/${id}/`,
        method: "PUT",
        body: lesson,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Lesson", id }],
    }),
    deleteLesson: builder.mutation<DeleteLessonResponse, number>({
      query: (id) => ({
        url: `/courses/lessons/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Lesson", id }],
    }),
  }),
})

export const {
  useCreateLessonMutation,
  useGetAllLessonsQuery,
  useGetLessonByIdQuery,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} = lessonsApi
