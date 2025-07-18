import { baseApi } from "./baseApi"
import type { LessonProgressPayload, LessonProgressResponse, AllLessonProgressResponse } from "../types/api"

export const lessonProgressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLessonProgress: builder.mutation<LessonProgressResponse, LessonProgressPayload>({
      query: (progress) => ({
        url: "/courses/lesson-progress/",
        method: "POST",
        body: progress,
      }),
      invalidatesTags: ["LessonProgress"],
    }),
    getAllLessonProgress: builder.query<AllLessonProgressResponse, void>({
      query: () => "/courses/lesson-progress/",
      providesTags: ["LessonProgress"],
    }),
  }),
})

export const { useCreateLessonProgressMutation, useGetAllLessonProgressQuery } = lessonProgressApi
