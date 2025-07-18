import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl:
    (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082") + "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "User",
    "Course",
    "Lesson",
    "Enrollment",
    "LessonProgress",
    "Review",
    "Opportunity",
    "Application",
    "Booking",
    "Bookings",
    "Mentors",
  ],
  endpoints: () => ({}),
});
