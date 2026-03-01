import { api } from "@/app/api";

const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    runSymptomChecker: builder.mutation({
      query: (body) => ({ url: "/diagnoses/symptom-check", method: "POST", body }),
    }),
    explainPrescription: builder.mutation({
      query: (body) => ({ url: "/diagnoses/prescription-explain", method: "POST", body }),
    }),
    runRiskFlagging: builder.mutation({
      query: ({ patientId, ...body }) => ({ url: `/diagnoses/risk-flag/${patientId}`, method: "POST", body }),
    }),
    getDiagnosisLogs: builder.query({
      query: (params) => ({ url: "/diagnoses/logs", params }),
      providesTags: ["Diagnosis"],
    }),
    getDiagnosisLog: builder.query({
      query: (id) => `/diagnoses/logs/${id}`,
    }),
  }),
});

export const {
  useRunSymptomCheckerMutation,
  useExplainPrescriptionMutation,
  useRunRiskFlaggingMutation,
  useGetDiagnosisLogsQuery,
  useGetDiagnosisLogQuery,
} = aiApi;
