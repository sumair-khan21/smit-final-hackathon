export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const ROLES = Object.freeze({
  ADMIN: "admin",
  DOCTOR: "doctor",
  RECEPTIONIST: "receptionist",
  PATIENT: "patient",
});

export const SUBSCRIPTION_PLANS = Object.freeze({
  FREE: "free",
  PRO: "pro",
});

export const ROUTES = Object.freeze({
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PATIENTS: "/dashboard/patients",
  APPOINTMENTS: "/dashboard/appointments",
  PRESCRIPTIONS: "/dashboard/prescriptions",
  AI_SYMPTOM_CHECKER: "/dashboard/ai/symptom-checker",
  AI_PRESCRIPTION_EXPLAIN: "/dashboard/ai/prescription-explain",
  AI_RISK_FLAGGING: "/dashboard/ai/risk-flagging",
  SCHEDULE: "/dashboard/appointments/schedule",
  ANALYTICS: "/dashboard/analytics",
  SUBSCRIPTION: "/dashboard/subscription",
  STAFF: "/dashboard/staff",
});