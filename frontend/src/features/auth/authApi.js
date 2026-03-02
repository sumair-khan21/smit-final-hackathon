import { api } from "@/app/api";
import { setCredentials, logout } from "./authSlice";

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── Register ──
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Pass full data so setCredentials can extract user + tokens
          dispatch(setCredentials(data.data));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Login ──
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Pass full data so setCredentials can extract user + tokens
          dispatch(setCredentials(data.data));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Logout ──
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          dispatch(logout());
        }
      },
    }),

    // ── Get Current User (verify session) ──
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data.data.user }));
        } catch {
          // not logged in — this is expected, do nothing
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
