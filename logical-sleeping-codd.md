# AI Clinic Management + Smart Diagnosis SaaS - Implementation Plan

## Context
Building an AI-powered Clinic Management SaaS for a MERN stack final hackathon. The project digitizes clinic operations (patients, appointments, prescriptions) with 4 user roles and AI-assisted diagnosis using Google Gemini. A solid boilerplate already exists with auth, RBAC, user CRUD, Cloudinary uploads, Redux/RTK Query, and Docker.

## Tech Decisions
- **AI**: Google Gemini (`gemini-1.5-flash`, free tier)
- **PDF**: jsPDF (frontend generation - simple & fast)
- **Charts**: Recharts
- **Subscription**: Simple `plan` field (free/pro) on user model
- **Roles**: admin, doctor, receptionist, patient (replace existing user/admin)

---

## PHASE 0: Foundation Changes (Modify Boilerplate for 4 Roles)

### Backend
| Task | File | Details |
|------|------|---------|
| Update roles & constants | `backend/src/constants/index.js` | Add ROLES (admin/doctor/receptionist/patient), SUBSCRIPTION_PLANS (free/pro), APPOINTMENT_STATUS, RISK_LEVELS |
| Update User model | `backend/src/models/user.model.js` | Add `phone`, `specialization` (doctors), `subscriptionPlan` fields. Change role enum to 4 roles, default to `patient` |
| Update validators | `backend/src/validators/user.validator.js` | Update role enum to 4 roles |
| Update auth validator | `backend/src/validators/auth.validator.js` | Add optional `phone` field to register |
| Add Gemini API key | `backend/src/config/env.config.js` | Add `GEMINI_API_KEY` to config |
| Register new routes | `backend/src/routes/index.js` | Add patient, appointment, prescription, diagnosis, analytics routes |

### Frontend
| Task | File | Details |
|------|------|---------|
| Update constants | `frontend/src/utils/constants.js` | New ROLES object (4 roles), ROUTES for dashboard pages |
| Update useAuth hook | `frontend/src/hooks/useAuth.js` | Add `isDoctor`, `isReceptionist`, `isPatient`, `isPro` helpers |
| Create DashboardLayout | `frontend/src/components/layout/DashboardLayout.jsx` | Sidebar + main content area for authenticated pages |
| Create Sidebar | `frontend/src/components/layout/Sidebar.jsx` | Role-based navigation links with lucide-react icons |
| Update router | `frontend/src/router/index.jsx` | Add all dashboard routes under DashboardLayout with ProtectedRoute |
| Refactor to shared API | `frontend/src/app/api.js` | Extract `baseQueryWithReauth` from authApi into shared `createApi` instance |
| Refactor authApi | `frontend/src/features/auth/authApi.js` | Use `api.injectEndpoints` instead of standalone createApi |
| Update store | `frontend/src/app/store.js` | Use shared `api` reducer/middleware |
| Update Login redirect | `frontend/src/pages/auth/LoginPage.jsx` | Redirect to `/dashboard` after login |

---

## PHASE 1: Patient + Appointment Management (Core CRUD)

### Backend - Patient Management
| Task | File |
|------|------|
| Patient model | `backend/src/models/patient.model.js` — name, age, gender, phone, email, address, bloodGroup, allergies, chronicConditions, emergencyContact, createdBy, userId |
| Patient validator | `backend/src/validators/patient.validator.js` |
| Patient service | `backend/src/services/patient.service.js` — CRUD + `getPatientHistory()` for timeline |
| Patient controller | `backend/src/controllers/patient.controller.js` |
| Patient routes | `backend/src/routes/patient.routes.js` |

**Patient Routes Access:**
| Route | Method | Access |
|-------|--------|--------|
| `/patients` | POST | Admin, Receptionist |
| `/patients` | GET | Admin, Doctor, Receptionist |
| `/patients/:id` | GET | All authenticated (patients: own only) |
| `/patients/:id/history` | GET | All authenticated (patients: own only) |
| `/patients/:id` | PATCH | Admin, Receptionist |
| `/patients/:id` | DELETE | Admin |

### Backend - Appointment Management
| Task | File |
|------|------|
| Appointment model | `backend/src/models/appointment.model.js` — patientId, doctorId, date, timeSlot, status, reason, notes, createdBy. Unique index on {doctorId, date, timeSlot} |
| Appointment validator | `backend/src/validators/appointment.validator.js` |
| Appointment service | `backend/src/services/appointment.service.js` — CRUD + `getDoctorSchedule()` + `getDailyAppointments()` |
| Appointment controller | `backend/src/controllers/appointment.controller.js` |
| Appointment routes | `backend/src/routes/appointment.routes.js` |

**Appointment Routes Access:**
| Route | Method | Access |
|-------|--------|--------|
| `/appointments` | POST | Admin, Receptionist |
| `/appointments` | GET | All (filtered by role - doctors see own, patients see own) |
| `/appointments/:id` | GET | All authenticated |
| `/appointments/:id` | PATCH | Admin, Receptionist |
| `/appointments/:id/status` | PATCH | Admin, Doctor, Receptionist |
| `/appointments/doctor/:id/schedule` | GET | All authenticated |
| `/appointments/:id` | DELETE | Admin, Receptionist |

### Frontend - Patient & Appointment
| Task | File |
|------|------|
| Patient API slice | `frontend/src/features/patients/patientApi.js` |
| Appointment API slice | `frontend/src/features/appointments/appointmentApi.js` |
| Patient List page | `frontend/src/pages/dashboard/patients/PatientListPage.jsx` |
| Patient Detail page | `frontend/src/pages/dashboard/patients/PatientDetailPage.jsx` |
| Add Patient page | `frontend/src/pages/dashboard/patients/AddPatientPage.jsx` |
| Appointment List page | `frontend/src/pages/dashboard/appointments/AppointmentListPage.jsx` |
| Book Appointment page | `frontend/src/pages/dashboard/appointments/BookAppointmentPage.jsx` |
| Doctor Schedule page | `frontend/src/pages/dashboard/appointments/DoctorSchedulePage.jsx` |
| Dashboard page | `frontend/src/pages/dashboard/DashboardPage.jsx` — role-based summary cards |
| DataTable component | `frontend/src/components/shared/DataTable.jsx` |
| StatusBadge component | `frontend/src/components/shared/StatusBadge.jsx` |
| EmptyState component | `frontend/src/components/shared/EmptyState.jsx` |

**Install:** `npm install date-fns` (frontend)

---

## PHASE 2: Prescription System + Medical History Timeline

### Backend
| Task | File |
|------|------|
| Prescription model | `backend/src/models/prescription.model.js` — patientId, doctorId, appointmentId, diagnosis, medicines[{name, dosage, frequency, duration, instructions}], notes, followUpDate |
| Prescription validator | `backend/src/validators/prescription.validator.js` |
| Prescription service | `backend/src/services/prescription.service.js` — CRUD + `getPrescriptionsByPatient()` |
| Prescription controller | `backend/src/controllers/prescription.controller.js` |
| Prescription routes | `backend/src/routes/prescription.routes.js` |

**Prescription Routes:**
| Route | Method | Access |
|-------|--------|--------|
| `/prescriptions` | POST | Doctor |
| `/prescriptions` | GET | All (filtered by role) |
| `/prescriptions/:id` | GET | All authenticated |
| `/prescriptions/patient/:patientId` | GET | All authenticated |
| `/prescriptions/:id` | PATCH | Doctor, Admin |

### Frontend
| Task | File |
|------|------|
| Prescription API slice | `frontend/src/features/prescriptions/prescriptionApi.js` |
| Prescription List page | `frontend/src/pages/dashboard/prescriptions/PrescriptionListPage.jsx` |
| Create Prescription page | `frontend/src/pages/dashboard/prescriptions/CreatePrescriptionPage.jsx` — dynamic medicines form |
| Prescription Detail page | `frontend/src/pages/dashboard/prescriptions/PrescriptionDetailPage.jsx` — view + PDF download |
| PDF generator utility | `frontend/src/utils/generatePrescriptionPDF.js` — jsPDF |
| Medical Timeline component | `frontend/src/components/patients/MedicalTimeline.jsx` — visual timeline in PatientDetailPage |
| Enhance Patient History | Update `backend/src/services/patient.service.js` `getPatientHistory()` to aggregate appointments + prescriptions + diagnoses |

**Install:** `npm install jspdf` (frontend)

---

## PHASE 3: AI Features (Google Gemini)

### Backend
| Task | File |
|------|------|
| Gemini config | `backend/src/config/gemini.config.js` — initialize GoogleGenerativeAI |
| AI service | `backend/src/services/ai.service.js` — `symptomChecker()`, `prescriptionExplanation()`, `riskFlagging()`, `predictiveAnalytics()` |
| DiagnosisLog model | `backend/src/models/diagnosisLog.model.js` — symptoms, aiResponse, riskLevel, doctorId, patientId, doctorNotes, finalDiagnosis |
| AI validator | `backend/src/validators/ai.validator.js` |
| AI controller | `backend/src/controllers/ai.controller.js` |
| Diagnosis routes | `backend/src/routes/diagnosis.routes.js` |
| Subscription middleware | `backend/src/middlewares/subscription.middleware.js` — `requirePro` for Pro-only features |

**AI Routes:**
| Route | Method | Access | Plan |
|-------|--------|--------|------|
| `/diagnoses/symptom-check` | POST | Doctor | Free |
| `/diagnoses/prescription-explain` | POST | Doctor, Patient | Free |
| `/diagnoses/risk-flag/:patientId` | POST | Doctor | Pro |
| `/diagnoses/logs` | GET | Doctor, Admin | Free |
| `/diagnoses/logs/:id` | GET | Authenticated | Free |

**Graceful fallback:** All AI endpoints wrapped in try/catch — if Gemini fails, return `{ error: "AI service temporarily unavailable", fallback: true }` so the app still works.

### Frontend
| Task | File |
|------|------|
| AI API slice | `frontend/src/features/ai/aiApi.js` |
| Symptom Checker page | `frontend/src/pages/dashboard/ai/SymptomCheckerPage.jsx` — form + AI response cards |
| Prescription Explain page | `frontend/src/pages/dashboard/ai/PrescriptionExplainPage.jsx` |
| Risk Flagging page | `frontend/src/pages/dashboard/ai/RiskFlaggingPage.jsx` (Pro only) |
| AIResponseCard component | `frontend/src/components/ai/AIResponseCard.jsx` |
| ProBadge component | `frontend/src/components/shared/ProBadge.jsx` — lock icon on Pro features |

**Install:** `npm install @google/generative-ai` (backend)

---

## PHASE 4: Analytics Dashboard + SaaS Subscription

### Backend
| Task | File |
|------|------|
| Analytics service | `backend/src/services/analytics.service.js` — `getAdminAnalytics()`, `getDoctorAnalytics()`, `getPredictiveAnalytics()` |
| Analytics controller | `backend/src/controllers/analytics.controller.js` |
| Analytics routes | `backend/src/routes/analytics.routes.js` |
| Subscription endpoint | Add `updateSubscription()` to `backend/src/services/user.service.js` + route in user routes |

**Analytics Data:**
- **Admin**: total patients, total doctors, monthly appointments, simulated revenue, most common diagnoses (top 10)
- **Doctor**: daily appointments, monthly stats, prescription count
- **Predictive (Pro)**: common disease this month, patient load forecast, doctor performance

### Frontend
| Task | File |
|------|------|
| Analytics API slice | `frontend/src/features/analytics/analyticsApi.js` |
| Admin Analytics page | `frontend/src/pages/dashboard/analytics/AdminAnalyticsPage.jsx` — stat cards + bar/pie charts |
| Doctor Analytics page | `frontend/src/pages/dashboard/analytics/DoctorAnalyticsPage.jsx` — line chart + stat cards |
| Subscription page | `frontend/src/pages/dashboard/SubscriptionPage.jsx` — plan comparison + toggle |
| StatsCard component | `frontend/src/components/analytics/StatsCard.jsx` |
| Chart components | `frontend/src/components/analytics/AppointmentChart.jsx`, `DiagnosisChart.jsx` |

**Install:** `npm install recharts` (frontend)

---

## PHASE 5: Polish + Demo Prep

| Task | File |
|------|------|
| Add shadcn/ui components | `npx shadcn@latest add dialog select dropdown-menu table badge tabs avatar separator sheet textarea` |
| Seed script | `backend/src/scripts/seed.js` — 1 admin, 2 doctors, 1 receptionist, 5 patients, appointments, prescriptions |
| ConfirmDialog component | `frontend/src/components/shared/ConfirmDialog.jsx` |
| Update HomePage | `frontend/src/pages/HomePage.jsx` — medical-themed landing page |
| Loading skeletons | Add to all list pages |

---

## Role Access Matrix

| Feature | Admin | Doctor | Receptionist | Patient |
|---------|-------|--------|--------------|---------|
| Manage doctors/receptionists | Yes | - | - | - |
| Register patients | Yes | - | Yes | - |
| Edit patient info | Yes | - | Yes | Own only |
| Book appointments | Yes | - | Yes | - |
| View appointments | All | Own | All | Own |
| Update appointment status | Yes | Own | Yes | - |
| Create prescriptions | - | Yes | - | - |
| View prescriptions | All | Own | - | Own |
| Download prescription PDF | Yes | Yes | - | Own |
| AI Symptom Checker | - | Yes | - | - |
| AI Prescription Explain | - | Yes | - | Own |
| AI Risk Flagging (Pro) | - | Yes | - | - |
| Admin Analytics | Yes | - | - | - |
| Doctor Analytics | - | Yes | - | - |
| Predictive Analytics (Pro) | Yes | - | - | - |
| Manage Subscription | Yes | - | - | - |

---

## npm Installs Summary
- **Backend**: `npm install @google/generative-ai`
- **Frontend**: `npm install jspdf recharts date-fns`
- **shadcn/ui**: `npx shadcn@latest add dialog select dropdown-menu table badge tabs avatar separator sheet textarea`

## Verification Plan
1. **Phase 0**: Register users with all 4 roles, verify login redirects to dashboard, sidebar shows correct links per role
2. **Phase 1**: Create patients as receptionist, book appointments, verify doctor sees only their appointments, patient sees only their own
3. **Phase 2**: Doctor creates prescription, patient downloads PDF, verify medical timeline shows all entries
4. **Phase 3**: Doctor uses symptom checker, verify AI response renders, verify system works when AI fails (graceful fallback), verify Pro features are locked for Free plan
5. **Phase 4**: Admin sees analytics with charts, doctor sees personal stats, toggle subscription plan
6. **Phase 5**: Run seed script, verify all demo data appears correctly
