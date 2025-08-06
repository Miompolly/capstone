import { baseApi } from "./baseApi";
import type { Mentor } from "../types/api";
import axiosInstance from "./axiosInstance";

export const mentorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMentors: builder.query<Mentor[], void>({
      query: () => "/auth/mentors/",
      transformResponse: (response: Mentor[]) => {
        console.log("API: Mentors response:", response);
        return response;
      },
      providesTags: ["Mentors"],
    }),
  }),
});

export const { useGetAllMentorsQuery } = mentorsApi;

export const getMentorAnalytics = async () => {
  try {
    const response = await axiosInstance.get("/api/auth/analytics/mentor/");
    return response.data;
  } catch (error: any) {
    console.error("Mentor analytics fetch error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
