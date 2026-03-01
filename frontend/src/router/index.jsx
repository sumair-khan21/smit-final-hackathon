import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
import Layout from "@/components/layout/Layout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Route Guards
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PublicRoute from "@/components/shared/PublicRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

// Public Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Dashboard Pages (lazy loaded)
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));

const PatientListPage = lazy(() => import("@/pages/dashboard/patients/PatientListPage"));
const PatientDetailPage = lazy(() => import("@/pages/dashboard/patients/PatientDetailPage"));
const AddPatientPage = lazy(() => import("@/pages/dashboard/patients/AddPatientPage"));

const AppointmentListPage = lazy(() => import("@/pages/dashboard/appointments/AppointmentListPage"));
const BookAppointmentPage = lazy(() => import("@/pages/dashboard/appointments/BookAppointmentPage"));
const DoctorSchedulePage = lazy(() => import("@/pages/dashboard/appointments/DoctorSchedulePage"));

const PrescriptionListPage = lazy(() => import("@/pages/dashboard/prescriptions/PrescriptionListPage"));
const CreatePrescriptionPage = lazy(() => import("@/pages/dashboard/prescriptions/CreatePrescriptionPage"));
const PrescriptionDetailPage = lazy(() => import("@/pages/dashboard/prescriptions/PrescriptionDetailPage"));

const SymptomCheckerPage = lazy(() => import("@/pages/dashboard/ai/SymptomCheckerPage"));
const PrescriptionExplainPage = lazy(() => import("@/pages/dashboard/ai/PrescriptionExplainPage"));
const RiskFlaggingPage = lazy(() => import("@/pages/dashboard/ai/RiskFlaggingPage"));

const AdminAnalyticsPage = lazy(() => import("@/pages/dashboard/analytics/AdminAnalyticsPage"));
const DoctorAnalyticsPage = lazy(() => import("@/pages/dashboard/analytics/DoctorAnalyticsPage"));

const SubscriptionPage = lazy(() => import("@/pages/dashboard/SubscriptionPage"));
const StaffManagementPage = lazy(() => import("@/pages/dashboard/staff/StaffManagementPage"));

const PageLoader = () => (
  <div className="flex h-full items-center justify-center py-20">
    <LoadingSpinner size="lg" />
  </div>
);

const router = createBrowserRouter([
  // ── Public Layout (Header + Footer) ──
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
    ],
  },

  // ── Dashboard Layout (Sidebar) ──
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },

      // Patients
      {
        path: "patients",
        element: (
          <ProtectedRoute allowedRoles={["admin", "doctor", "receptionist"]}>
            <Suspense fallback={<PageLoader />}>
              <PatientListPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "patients/add",
        element: (
          <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
            <Suspense fallback={<PageLoader />}>
              <AddPatientPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "patients/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PatientDetailPage />
          </Suspense>
        ),
      },

      // Appointments
      {
        path: "appointments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AppointmentListPage />
          </Suspense>
        ),
      },
      {
        path: "appointments/book",
        element: (
          <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
            <Suspense fallback={<PageLoader />}>
              <BookAppointmentPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "appointments/schedule",
        element: (
          <ProtectedRoute allowedRoles={["admin", "doctor", "receptionist"]}>
            <Suspense fallback={<PageLoader />}>
              <DoctorSchedulePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Prescriptions
      {
        path: "prescriptions",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrescriptionListPage />
          </Suspense>
        ),
      },
      {
        path: "prescriptions/create",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Suspense fallback={<PageLoader />}>
              <CreatePrescriptionPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "prescriptions/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrescriptionDetailPage />
          </Suspense>
        ),
      },

      // AI Tools (Doctor only)
      {
        path: "ai/symptom-checker",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Suspense fallback={<PageLoader />}>
              <SymptomCheckerPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "ai/prescription-explain",
        element: (
          <ProtectedRoute allowedRoles={["doctor", "patient"]}>
            <Suspense fallback={<PageLoader />}>
              <PrescriptionExplainPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "ai/risk-flagging",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <Suspense fallback={<PageLoader />}>
              <RiskFlaggingPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Analytics
      {
        path: "analytics",
        element: (
          <ProtectedRoute allowedRoles={["admin", "doctor"]}>
            <Suspense fallback={<PageLoader />}>
              {/* Renders admin or doctor analytics based on role */}
              <AdminAnalyticsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Subscription (Admin)
      {
        path: "subscription",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoader />}>
              <SubscriptionPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      // Staff Management (Admin)
      {
        path: "staff",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Suspense fallback={<PageLoader />}>
              <StaffManagementPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },

  // ── 404 ──
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
