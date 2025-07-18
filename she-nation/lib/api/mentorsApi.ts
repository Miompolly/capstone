import { baseApi } from "./baseApi";
import type { Mentor } from "../types/api";

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
