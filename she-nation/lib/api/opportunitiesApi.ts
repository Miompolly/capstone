import { baseApi } from "./baseApi";
import type {
  OpportunityPayload,
  OpportunityResponse,
  DeleteOpportunityResponse,
  ApplicationPayload,
  ApplicationResponse,
  Application,
  Opportunity,
} from "../types/api";

export const opportunitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Job/Opportunity
    createOpportunity: builder.mutation<
      OpportunityResponse,
      OpportunityPayload
    >({
      query: (payload) => ({
        url: "/applications/opportunities/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Opportunities"],
    }),

    // Update Job/Opportunity by ID
    updateOpportunity: builder.mutation<
      OpportunityResponse,
      { id: number; payload: OpportunityPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/applications/opportunities/${id}/`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Opportunities"],
    }),

    // Delete Job/Opportunity by ID
    deleteOpportunity: builder.mutation<DeleteOpportunityResponse, number>({
      query: (id) => ({
        url: `/applications/opportunities/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Opportunities"],
    }),

    // Apply to a Job
    applyToOpportunity: builder.mutation<
      ApplicationResponse,
      { opportunityId: number; payload: ApplicationPayload }
    >({
      query: ({ opportunityId, payload }) => ({
        url: `/applications/opportunities/${opportunityId}/applications/`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Applications"],
    }),

    // Get Application by ID
    getApplicationById: builder.query<Application, number>({
      query: (id) => `/applications/${id}/`,
      providesTags: ["Applications"],
    }),

    // Get all opportunities (for job listings)
    getAllOpportunities: builder.query<Opportunity[], void>({
      query: () => "/applications/opportunities/",
      providesTags: ["Opportunities"],
    }),

    // Get opportunity by ID
    getOpportunityById: builder.query<Opportunity, number>({
      query: (id) => `/applications/opportunities/${id}/`,
      providesTags: ["Opportunities"],
    }),

    // Get applications for jobs created by current user
    getMyOpportunityApplications: builder.query<Application[], void>({
      query: () => "/applications/my-opportunity-applications/",
      providesTags: ["Applications"],
    }),
  }),
});

export const {
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
  useApplyToOpportunityMutation,
  useGetApplicationByIdQuery,
  useGetAllOpportunitiesQuery,
  useGetOpportunityByIdQuery,
  useGetMyOpportunityApplicationsQuery,
} = opportunitiesApi;
