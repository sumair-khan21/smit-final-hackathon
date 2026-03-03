<div align="center">

# MediCore AI — Smart Clinic Management System

### AI-Powered • Role-Based • Full-Stack • Production-Ready

A comprehensive clinic management SaaS platform built for modern healthcare — with intelligent AI diagnosis tools, role-based dashboards, appointment scheduling, prescription management, and real-time analytics.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb)
![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%20v4-06B6D4?style=flat-square&logo=tailwindcss)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=flat-square&logo=redux)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Role-Based Access](#role-based-access)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Subscription Plans](#subscription-plans)
- [Acknowledgements](#acknowledgements)

---

## Overview

**MediCore AI** is a full-stack healthcare SaaS platform that brings together patient management, appointment scheduling, prescription handling, and AI-powered medical tools — all under one roof.

The system supports **four distinct user roles** (Admin, Doctor, Receptionist, Patient), each with a fully isolated dashboard and data visibility. Every user only sees and interacts with what they are authorized to access.

Built as a **Final Hackathon Project** at **Saylani Mass IT Training (SMIT)**, MediCore AI demonstrates a production-grade application with real-world features including AI diagnosis, risk flagging, PDF generation, subscription gating, and cross-origin live deployment.

---

## Features

### Core Platform
- **Role-Based Dashboards** — Four completely isolated experiences tailored per role
- **Patient Management** — Full CRUD: medical history, allergies, chronic conditions, blood group, emergency contacts
- **Appointment Scheduling** — Book, confirm, complete, cancel with slot conflict detection and doctor daily schedule view
- **Prescription System** — Create rich prescriptions with medications, dosage, instructions; download as professional PDFs
- **Staff Management** — Admin creates and manages doctor/receptionist accounts with role assignment

### AI Features (Google Gemini)
- **AI Symptom Checker** — Input symptoms and get possible conditions, urgency level, and recommendations
- **AI Prescription Explainer** — Patients understand their prescriptions in plain language with dosage guidance and warnings
- **AI Risk Flagging** — Doctors get AI-powered risk analysis based on patient history and diagnoses *(Pro plan)*
- **Diagnosis Logs** — Full history of every AI interaction with detailed breakdown of AI responses

### Analytics & Monitoring
- **Admin Analytics** — System-wide stats: total patients, appointments, prescriptions, top diagnoses, bar charts
- **Doctor Analytics** — Personal metrics: patients seen, appointments completed, prescriptions written, AI usage
- **System Management** — Monitor system health, manage all users' subscription plans, view top diagnosis trends

### Security & Auth
- **JWT Authentication** — Access token (15 min) + Refresh token rotation (7 days)
- **Dual Token Storage** — HttpOnly cookies + localStorage for seamless cross-origin live deployments
- **Bearer Token Headers** — Works reliably across different domains (Vercel + Railway)
- **Rate Limiting** — Protects auth endpoints from brute force attacks
- **RBAC Middleware** — Every API route is guarded by role-based access control

### UX & Design
- **Mobile-First Responsive** — Fully optimized for all screen sizes with bottom navigation bar on mobile
- **Premium UI** — Glassmorphism effects, gradient accents, smooth transitions, modern card layouts
- **Toast Notifications** — Real-time feedback on every action via Sonner
- **Polished Empty States & Loaders** — Every screen handles loading, empty, and error states gracefully
- **Custom Favicon & Metadata** — Branded SVG favicon, Open Graph tags for social sharing

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Redux Toolkit + RTK Query | State management & API data fetching/caching |
| React Router DOM v7 | Client-side routing with lazy loading |
| Tailwind CSS v4 | Utility-first styling |
| Recharts | Charts and analytics visualizations |
| jsPDF | Client-side PDF prescription generation |
| Lucide React | Icon library |
| Sonner | Toast notifications |
| Vite 7 | Build tool |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token | Authentication (access + refresh) |
| bcryptjs | Password hashing |
| Google Gemini AI | AI symptom checker, prescription explainer, risk flagging |
| Cloudinary | Avatar and image storage |
| Zod | Request validation schemas |
| Helmet + CORS | Security headers |
| express-rate-limit | API rate limiting |
| Multer | File upload handling |
| Morgan | HTTP request logging |

---

## Role-Based Access

| Feature | Admin | Doctor | Receptionist | Patient |
|---|:---:|:---:|:---:|:---:|
| View all patients | ✅ | ✅ | ✅ | ❌ |
| Add / Edit patients | ✅ | ❌ | ✅ | ❌ |
| View appointments | ✅ All | ✅ Own | ✅ All | ✅ Own |
| Book appointments | ✅ | ❌ | ✅ | ❌ |
| Cancel appointments | ✅ | ❌ | ✅ | ✅ (own) |
| Daily doctor schedule | ✅ | ✅ | ✅ | ❌ |
| View prescriptions | ✅ All | ✅ All | ✅ All | ✅ Own |
| Create prescriptions | ❌ | ✅ | ❌ | ❌ |
| Download prescription PDF | ✅ | ✅ | ✅ | ✅ |
| AI Symptom Checker | ✅ | ✅ | ❌ | ✅ |
| AI Prescription Explainer | ✅ | ✅ | ❌ | ✅ |
| AI Risk Flagging | ❌ | ✅ Pro | ❌ | ❌ |
| Diagnosis Logs | ✅ | ✅ | ❌ | ❌ |
| Admin Analytics | ✅ | ❌ | ❌ | ❌ |
| Doctor Analytics | ❌ | ✅ | ❌ | ❌ |
| Staff Management | ✅ | ❌ | ❌ | ❌ |
| System Management | ✅ | ❌ | ❌ | ❌ |
| Manage Subscriptions | ✅ | ❌ | ❌ | ❌ |

---

## Project Structure

```
medicore-ai/
│
├── frontend/                          # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg                # Custom medical cross SVG favicon
│   ├── src/
│   │   ├── app/
│   │   │   ├── api.js                 # RTK Query base + Bearer token + refresh logic
│   │   │   └── store.js               # Redux store
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx         # Sticky header with scroll effect, mobile menu
│   │   │   │   ├── Footer.jsx         # Footer with links and contact info
│   │   │   │   ├── Sidebar.jsx        # Role-aware dashboard sidebar
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── BottomNavigation.jsx  # Mobile bottom nav bar
│   │   │   │   └── Layout.jsx
│   │   │   ├── shared/
│   │   │   │   ├── ProtectedRoute.jsx # Auth + role guard
│   │   │   │   ├── PublicRoute.jsx    # Redirect if already logged in
│   │   │   │   ├── StatusBadge.jsx    # Appointment/status color badges
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   └── ProBadge.jsx
│   │   │   └── ui/                    # Base components: Button, Card, Input, Label
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── authSlice.js       # Auth state + localStorage persistence
│   │   │   │   └── authApi.js         # login, register, logout, getMe
│   │   │   ├── patients/patientApi.js
│   │   │   ├── appointments/appointmentApi.js
│   │   │   ├── prescriptions/prescriptionApi.js
│   │   │   ├── ai/aiApi.js            # symptomCheck, prescriptionExplain, riskFlag, logs
│   │   │   ├── analytics/analyticsApi.js
│   │   │   └── users/userApi.js
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js             # Role helpers: isAdmin, isDoctor, isPatient, isPro
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           # Landing: hero, features, roles, pricing, CTA
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   └── dashboard/
│   │   │       ├── DashboardPage.jsx          # Role-aware home with stats + quick actions
│   │   │       ├── SubscriptionPage.jsx
│   │   │       ├── admin/
│   │   │       │   └── SystemManagementPage.jsx   # Subscription management + system metrics
│   │   │       ├── ai/
│   │   │       │   ├── SymptomCheckerPage.jsx
│   │   │       │   ├── PrescriptionExplainPage.jsx
│   │   │       │   ├── RiskFlaggingPage.jsx
│   │   │       │   └── DiagnosisLogsPage.jsx
│   │   │       ├── analytics/
│   │   │       │   ├── AdminAnalyticsPage.jsx
│   │   │       │   └── DoctorAnalyticsPage.jsx
│   │   │       ├── appointments/
│   │   │       │   ├── AppointmentListPage.jsx
│   │   │       │   ├── BookAppointmentPage.jsx
│   │   │       │   └── DoctorSchedulePage.jsx
│   │   │       ├── patients/
│   │   │       │   ├── PatientListPage.jsx
│   │   │       │   ├── PatientDetailPage.jsx
│   │   │       │   └── AddPatientPage.jsx
│   │   │       ├── prescriptions/
│   │   │       │   ├── PrescriptionListPage.jsx
│   │   │       │   ├── PrescriptionDetailPage.jsx
│   │   │       │   └── CreatePrescriptionPage.jsx
│   │   │       └── staff/
│   │   │           └── StaffManagementPage.jsx
│   │   │
│   │   ├── router/index.jsx           # All routes with role guards + lazy loading
│   │   └── utils/
│   │       ├── constants.js           # API_BASE_URL, ROLES, ROUTES
│   │       └── generatePrescriptionPDF.js  # jsPDF prescription generator
│   │
│   └── index.html                     # Entry HTML with SEO + Open Graph meta tags
│
└── backend/                           # Node.js + Express backend
    └── src/
        ├── config/                    # DB, CORS, Cloudinary, Gemini, Multer, Env config
        ├── constants/                 # ROLES, SUBSCRIPTION_PLANS, HTTP_STATUS, APPOINTMENT_STATUS
        ├── controllers/               # auth, user, patient, appointment, prescription, ai, analytics
        ├── middlewares/               # authenticate, authorize, rateLimiter, validate, subscription check
        ├── models/
        │   ├── user.model.js
        │   ├── patient.model.js
        │   ├── appointment.model.js
        │   ├── prescription.model.js
        │   └── diagnosisLog.model.js
        ├── routes/                    # Express routers for every resource
        ├── services/                  # Business logic layer (separated from controllers)
        ├── validators/                # Zod schemas for all endpoints
        ├── utils/                     # ApiError, ApiResponse, asyncHandler
        ├── scripts/seed.js            # Database seeder with demo users
        ├── app.js                     # Express app setup with all middleware
        └── server.js                  # HTTP server entry point
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/medicore-ai.git
cd medicore-ai
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` — see [Environment Variables](#environment-variables) below.

```bash
# Seed the database with demo users and sample data
npm run seed

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

### Demo Accounts

After running the seed script, use these accounts to explore the platform:

| Role | Email | Password |
|---|---|---|
| Admin | admin@aiclinic.com | Admin@123 |
| Doctor | doctor@aiclinic.com | Doctor@123 |
| Receptionist | receptionist@aiclinic.com | Reception@123 |
| Patient | usman@aiclinic.com | Patient@123 |

---

## Environment Variables

### Backend — `backend/.env`

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medicore

# JWT
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Client URL (comma-separated for multiple origins)
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend — `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> **For production:** Set `VITE_API_BASE_URL` to your deployed backend URL (e.g. Railway), and set `CLIENT_URL` on the backend to your deployed frontend URL (e.g. Vercel). Comma-separate multiple origins: `CLIENT_URL=https://yourapp.vercel.app,http://localhost:5173`

---

## API Reference

All endpoints are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login and receive tokens |
| POST | `/auth/logout` | Private | Logout and clear tokens |
| POST | `/auth/refresh-token` | Public | Rotate access + refresh tokens |
| GET | `/auth/me` | Private | Get current logged-in user |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin, Receptionist | Get all users (paginated, role-filterable) |
| GET | `/users/:id` | Owner, Admin | Get user by ID |
| PATCH | `/users/:id/profile` | Owner, Admin | Update profile info |
| PATCH | `/users/:id/avatar` | Owner, Admin | Upload avatar to Cloudinary |
| DELETE | `/users/:id/avatar` | Owner, Admin | Remove avatar |
| PATCH | `/users/:id/change-password` | Owner | Change password |
| PATCH | `/users/:id/role` | Admin | Change user role |
| PATCH | `/users/:id/subscription` | Admin | Change subscription plan |
| PATCH | `/users/:id/deactivate` | Admin | Deactivate user account |
| DELETE | `/users/:id` | Admin | Permanently delete user |

### Patients

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/patients` | Admin, Receptionist | Create patient record |
| GET | `/patients` | Admin, Doctor, Receptionist | Get all patients (paginated, searchable) |
| GET | `/patients/:id` | Authenticated | Get patient details |
| GET | `/patients/:id/history` | Authenticated | Get full patient history (appointments, prescriptions, diagnoses) |
| PATCH | `/patients/:id` | Admin, Receptionist | Update patient record |
| DELETE | `/patients/:id` | Admin | Delete patient record |

### Appointments

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/appointments` | Admin, Receptionist | Book appointment (with conflict check) |
| GET | `/appointments` | All roles (role-filtered) | Get appointments for current user's role |
| GET | `/appointments/doctor/:id/schedule` | Authenticated | Get doctor's appointments for a date |
| GET | `/appointments/:id` | Authenticated | Get single appointment |
| PATCH | `/appointments/:id` | Admin, Receptionist | Update appointment details |
| PATCH | `/appointments/:id/status` | Admin, Doctor, Receptionist | Confirm / complete appointment |
| DELETE | `/appointments/:id` | Admin, Receptionist, Patient | Cancel appointment |

### Prescriptions

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/prescriptions` | Doctor | Create prescription |
| GET | `/prescriptions` | All roles (role-filtered) | Get prescriptions for current user's role |
| GET | `/prescriptions/patient/:patientId` | Authenticated | Get all prescriptions for a patient |
| GET | `/prescriptions/:id` | Authenticated | Get prescription details |
| PATCH | `/prescriptions/:id` | Doctor, Admin | Update prescription |

### AI / Diagnosis

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/diagnoses/symptom-check` | Doctor, Patient | Run AI symptom analysis |
| POST | `/diagnoses/prescription-explain` | Doctor, Patient | AI explains a prescription |
| POST | `/diagnoses/risk-flag/:patientId` | Doctor (Pro only) | AI patient risk assessment |
| GET | `/diagnoses/logs` | Doctor, Admin | Get all AI diagnosis logs (paginated) |
| GET | `/diagnoses/logs/:id` | Authenticated | Get single diagnosis log detail |

### Analytics

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/analytics/admin` | Admin | System-wide statistics and charts |
| GET | `/analytics/doctor` | Doctor | Personal performance metrics |

---

## Subscription Plans

| Feature | Free | Pro |
|---|:---:|:---:|
| Patient Management | ✅ | ✅ |
| Appointment Scheduling | ✅ | ✅ |
| Prescriptions + PDF | ✅ | ✅ |
| AI Symptom Checker | ✅ | ✅ |
| AI Prescription Explainer | ✅ | ✅ |
| AI Risk Flagging | ❌ | ✅ |
| Full Analytics | Limited | ✅ |
| Priority Support | ❌ | ✅ |

Subscription plans are managed by the Admin through the **System Management** dashboard. Admins can upgrade or downgrade any user's plan with a single click.

---

## Acknowledgements

This project was built as the **Final Hackathon Project** at **Saylani Mass IT Training (SMIT)**.

A heartfelt thank you to our incredible teachers and mentors:

**Sir Ali Aftab** — For your exceptional technical guidance, your dedication to every student, and pushing us to think beyond the basics. Your teaching made complex concepts approachable and your belief in us never wavered.

**Sir Rizwan Bhatti** — For your mentorship, support, and for being the kind of teacher who genuinely cares about students' growth. You didn't just teach us to code — you taught us to think like engineers and take pride in what we build.

SMIT gave us the platform. You both gave us the confidence to build something real.

---

<div align="center">

Built with dedication by **Sumair** at **SMIT**

</div>
