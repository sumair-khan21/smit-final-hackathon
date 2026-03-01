import { api } from "@/app/api";

const patientApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: (params) => ({ url: "/patients", params }),
      providesTags: ["Patient"],
    }),
    getPatient: builder.query({
      query: (id) => `/patients/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Patient", id }],
    }),
    getPatientHistory: builder.query({
      query: (id) => `/patients/${id}/history`,
    }),
    createPatient: builder.mutation({
      query: (body) => ({ url: "/patients", method: "POST", body }),
      invalidatesTags: ["Patient"],
    }),
    updatePatient: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/patients/${id}`, method: "PATCH", body }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Patient", id }, "Patient"],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({ url: `/patients/${id}`, method: "DELETE" }),
      invalidatesTags: ["Patient"],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetPatientQuery,
  useGetPatientHistoryQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientApi;
