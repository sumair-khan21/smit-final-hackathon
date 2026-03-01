import { api } from "@/app/api";

const prescriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query({
      query: (params) => ({ url: "/prescriptions", params }),
      providesTags: ["Prescription"],
    }),
    getPrescription: builder.query({
      query: (id) => `/prescriptions/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Prescription", id }],
    }),
    getPatientPrescriptions: builder.query({
      query: (patientId) => `/prescriptions/patient/${patientId}`,
      providesTags: ["Prescription"],
    }),
    createPrescription: builder.mutation({
      query: (body) => ({ url: "/prescriptions", method: "POST", body }),
      invalidatesTags: ["Prescription"],
    }),
    updatePrescription: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/prescriptions/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Prescription"],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionQuery,
  useGetPatientPrescriptionsQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
} = prescriptionApi;
