import { baseApi } from "./baseApi"
import type {
  EnrollmentPayload,
  EnrollmentResponse,
  AllEnrollmentsResponse,
  DeleteEnrollmentResponse,
  UpdateEnrollmentPayload,
  UpdateEnrollmentResponse,
} from "../types/api"

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnrollment: builder.mutation<EnrollmentResponse, EnrollmentPayload>({
      query: (enrollment) => ({
        url: "/courses/enrollments/",
        method: "POST",
        body: enrollment,
      }),
      invalidatesTags: ["Enrollment"],
    }),
    getAllEnrollments: builder.query<AllEnrollmentsResponse, void>({
      query: () => "/courses/enrollments/",
      providesTags: ["Enrollment"],
    }),
    deleteEnrollment: builder.mutation<DeleteEnrollmentResponse, number>({
      query: (id) => ({
        url: `/courses/enrollments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Enrollment", id }],
    }),
    updateEnrollment: builder.mutation<UpdateEnrollmentResponse, { id: number; enrollment: UpdateEnrollmentPayload }>({
      query: ({ id, enrollment }) => ({
        url: `/courses/enrollments/${id}/`,
        method: "PUT",
        body: enrollment,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Enrollment", id }],
    }),
  }),
})

export const {
  useCreateEnrollmentMutation,
  useGetAllEnrollmentsQuery,
  useDeleteEnrollmentMutation,
  useUpdateEnrollmentMutation,
} = enrollmentsApi
