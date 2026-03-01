import { api } from "@/app/api";

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({ url: "/users", params }),
      providesTags: ["User"],
    }),
    createStaff: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserSubscription: builder.mutation({
      query: ({ userId, subscriptionPlan }) => ({
        url: `/users/${userId}/subscription`,
        method: "PATCH",
        body: { subscriptionPlan },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateStaffMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useUpdateUserSubscriptionMutation,
} = userApi;
