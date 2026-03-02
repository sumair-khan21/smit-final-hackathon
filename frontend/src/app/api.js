import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/utils/constants";
import { logout } from "@/features/auth/authSlice";

// ── Base query — sends Bearer token from localStorage + cookies as fallback ──
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    // Don't set Content-Type for file uploads
    if (endpoint !== "updateAvatar") {
      headers.set("Content-Type", "application/json");
    }
    // Attach access token from localStorage (works cross-origin on live deployments)
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
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
      const refreshToken = localStorage.getItem("refresh_token");

      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );

      if (refreshResult?.data?.success) {
        // Store the new tokens from response body
        const newAccess = refreshResult.data?.data?.accessToken;
        const newRefresh = refreshResult.data?.data?.refreshToken;
        if (newAccess) localStorage.setItem("access_token", newAccess);
        if (newRefresh) localStorage.setItem("refresh_token", newRefresh);

        // Retry original request with new token
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
