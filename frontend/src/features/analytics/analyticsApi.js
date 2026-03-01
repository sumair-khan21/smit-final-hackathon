import { api } from "@/app/api";

const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query({
      query: () => "/analytics/admin",
      providesTags: ["Analytics"],
    }),
    getDoctorAnalytics: builder.query({
      query: () => "/analytics/doctor",
      providesTags: ["Analytics"],
    }),
    getPredictiveAnalytics: builder.query({
      query: () => "/analytics/predictive",
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetDoctorAnalyticsQuery,
  useGetPredictiveAnalyticsQuery,
} = analyticsApi;
