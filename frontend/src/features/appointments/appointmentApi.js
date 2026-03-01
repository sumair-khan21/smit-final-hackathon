import { api } from "@/app/api";

const appointmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: (params) => ({ url: "/appointments", params }),
      providesTags: ["Appointment"],
    }),
    getAppointment: builder.query({
      query: (id) => `/appointments/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Appointment", id }],
    }),
    getDoctorSchedule: builder.query({
      query: ({ doctorId, date }) => ({ url: `/appointments/doctor/${doctorId}/schedule`, params: { date } }),
    }),
    createAppointment: builder.mutation({
      query: (body) => ({ url: "/appointments", method: "POST", body }),
      invalidatesTags: ["Appointment"],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/appointments/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Appointment"],
    }),
    updateAppointmentStatus: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/appointments/${id}/status`, method: "PATCH", body }),
      invalidatesTags: ["Appointment"],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({ url: `/appointments/${id}`, method: "DELETE" }),
      invalidatesTags: ["Appointment"],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentQuery,
  useGetDoctorScheduleQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useCancelAppointmentMutation,
} = appointmentApi;
