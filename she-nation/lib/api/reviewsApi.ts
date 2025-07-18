import { baseApi } from "./baseApi"
import type {
  ReviewPayload,
  ReviewResponse,
  AllReviewsResponse,
  ReviewByIdResponse,
  DeleteReviewResponse,
} from "../types/api"

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<ReviewResponse, { courseId: number; review: ReviewPayload }>({
      query: ({ courseId, review }) => ({
        url: `/courses/${courseId}/reviews/`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: ["Review"],
    }),
    getAllReviews: builder.query<AllReviewsResponse, number>({
      query: (courseId) => `/courses/${courseId}/reviews/`,
      providesTags: ["Review"],
    }),
    getReviewById: builder.query<ReviewByIdResponse, number>({
      query: (id) => `/courses/reviews/${id}/`,
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),
    deleteReview: builder.mutation<DeleteReviewResponse, number>({
      query: (id) => ({
        url: `/courses/reviews/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Review", id }],
    }),
  }),
})

export const { useCreateReviewMutation, useGetAllReviewsQuery, useGetReviewByIdQuery, useDeleteReviewMutation } =
  reviewsApi
