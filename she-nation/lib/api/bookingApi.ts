import { baseApi } from "./baseApi";
import type {
  Booking,
  BookingRequest,
  BookingResponse,
  BookingUpdatePayload,
  BookingUpdateResponse,
} from "../types/api";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bookMentor: builder.mutation<BookingResponse, BookingRequest>({
      query: (bookingData) => {
        console.log("API: Sending booking request:", bookingData);

        // Ensure the date is in the correct format (YYYY-MM-DD)
        const formattedData = {
          ...bookingData,
          day: bookingData.day, // Keep the date as-is since it should already be in YYYY-MM-DD format
        };

        console.log("API: Formatted booking data:", formattedData);

        return {
          url: "/auth/mentors/book/",
          method: "POST",
          body: formattedData,
        };
      },
      transformResponse: (response: BookingResponse) => {
        console.log("API: Booking response:", response);
        return response;
      },
      transformErrorResponse: (response: any) => {
        console.error("API: Booking error:", response);
        return response;
      },
      invalidatesTags: ["Bookings"],
    }),
    getMentorBookings: builder.query<Booking[], void>({
      query: () => {
        console.log("API: Fetching mentor bookings");
        return "/auth/mentor/bookings/";
      },
      transformResponse: (response: Booking[]) => {
        console.log("API: Raw bookings response:", response);

        // Log each booking to debug filtering
        response.forEach((booking, index) => {
          console.log(`Booking ${index + 1}:`, {
            id: booking.id,
            day: booking.day,
            time: booking.time,
            title: booking.title,
            mentor: booking.mentor,
            mentee: booking.mentee,
            note: booking.note,
          });
        });

        return response;
      },
      providesTags: ["Bookings"],
    }),
    getMenteeBookings: builder.query<Booking[], void>({
      query: () => {
        console.log("API: Fetching mentee bookings");
        return "/auth/mentee/bookings/";
      },
      transformResponse: (response: Booking[]) => {
        console.log("API: Raw mentee bookings response:", response);
        return response;
      },
      providesTags: ["Bookings"],
    }),
    updateBookingStatus: builder.mutation<
      BookingUpdateResponse,
      { id: number; status: BookingUpdatePayload }
    >({
      query: ({ id, status }) => ({
        url: `/auth/bookings/${id}/`,
        method: "PUT",
        body: status,
      }),
      invalidatesTags: ["Bookings"],
    }),
    deleteBooking: builder.mutation<{ detail: string }, number>({
      query: (id) => ({
        url: `/auth/bookings/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookings"],
    }),
  }),
});

export const {
  useBookMentorMutation,
  useGetMentorBookingsQuery,
  useGetMenteeBookingsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} = bookingApi;
