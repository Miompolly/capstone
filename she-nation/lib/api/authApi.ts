import { baseApi } from "./baseApi";
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  AllUsersResponse,
  VerifyUserPayload,
  VerifyUserResponse,
  DeleteUserResponse,
  UpdateUserStatusPayload,
  UpdateUserStatusResponse,
  ProfilePayload,
  ProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "../types/api";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (credentials) => ({
        url: "/auth/register/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<AllUsersResponse, void>({
      query: () => "/auth/all-users/",
      providesTags: ["User"],
    }),
    verifyUser: builder.mutation<VerifyUserResponse, VerifyUserPayload>({
      query: (payload) => ({
        url: "/auth/verify-user/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (userId) => ({
        url: `/auth/user/${userId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserStatus: builder.mutation<
      UpdateUserStatusResponse,
      UpdateUserStatusPayload
    >({
      query: (payload) => ({
        url: `/auth/user/${payload.user_id}/`,
        method: "PUT",
        body: { is_active: payload.is_active },
      }),
      invalidatesTags: ["User"],
    }),
    // Profile endpoints
    createProfile: builder.mutation<ProfileResponse, ProfilePayload>({
      query: (profile) => ({
        url: "/auth/profile/",
        method: "POST",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfilePayload
    >({
      query: (profile) => ({
        url: "/auth/profile/update/",
        method: "PUT",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetAllUsersQuery,
  useVerifyUserMutation,
  useDeleteUserMutation,
  useUpdateUserStatusMutation,
  useCreateProfileMutation,
  useUpdateProfileMutation,
} = authApi;
