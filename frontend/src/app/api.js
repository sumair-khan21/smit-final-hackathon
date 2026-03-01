import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/utils/constants";
import { logout } from "@/features/auth/authSlice";

// ── Base query with credentials (cookies) ──
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    // Don't set Content-Type for file uploads
    if (endpoint !== "updateAvatar") {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// ── Endpoints that should NOT trigger token refresh ──
const skipRefreshEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/me",
];

// ── Base query with automatic token refresh ──
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const url = typeof args === "string" ? args : args?.url;

    const shouldSkip = skipRefreshEndpoints.some(
      (endpoint) => url?.includes(endpoint)
    );

    if (!shouldSkip) {
      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult?.data?.success) {
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  }

  return result;
};

// ── Shared API instance — all feature APIs inject into this ──
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Patient", "Appointment", "Prescription", "Diagnosis", "Analytics"],
  endpoints: () => ({}),
});
