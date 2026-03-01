/**
 * Seed Script — Demo Data for AI Clinic Management SaaS
 * Run with: node src/scripts/seed.js
 */

const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");

// Models
const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const Appointment = require("../models/appointment.model");
const Prescription = require("../models/prescription.model");

const { ROLES, APPOINTMENT_STATUS } = require("../constants");

const buildMongoURI = () => {
  const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, MONGODB_URI } = process.env;
  if (MONGODB_URI) return MONGODB_URI;
  if (DB_USERNAME && DB_PASSWORD && DB_NAME && DB_HOST) {
    return `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
  }
  if (DB_NAME) return `mongodb://localhost:27017/${DB_NAME}`;
  return null;
};

const MONGO_URI = buildMongoURI();

async function seed() {
  console.log("🌱 Starting seed...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Patient.deleteMany({}),
    Appointment.deleteMany({}),
    Prescription.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing data");

  // ─── Users (plain text passwords — pre("save") hook hashes them) ───
  const admin = await User.create({
    name: "Dr. Clinic Admin",
    email: "admin@aiclinic.com",
    password: "Admin@123",
    role: ROLES.ADMIN,
    phone: "+92-300-0000001",
    subscriptionPlan: "pro",
    isActive: true,
  });

  const doctor1 = await User.create({
    name: "Dr. Sarah Khan",
    email: "sarah.khan@aiclinic.com",
    password: "Doctor@123",
    role: ROLES.DOCTOR,
    phone: "+92-300-0000002",
    specialization: "General Physician",
    subscriptionPlan: "pro",
    isActive: true,
  });

  const doctor2 = await User.create({
    name: "Dr. Ahmed Ali",
    email: "ahmed.ali@aiclinic.com",
    password: "Doctor@123",
    role: ROLES.DOCTOR,
    phone: "+92-300-0000003",
    specialization: "Cardiologist",
    subscriptionPlan: "free",
    isActive: true,
  });

  const receptionist = await User.create({
    name: "Aisha Malik",
    email: "aisha@aiclinic.com",
    password: "Recept@123",
    role: ROLES.RECEPTIONIST,
    phone: "+92-300-0000004",
    isActive: true,
  });

  const patientUser = await User.create({
    name: "Muhammad Usman",
    email: "usman@aiclinic.com",
    password: "Patient@123",
    role: ROLES.PATIENT,
    phone: "+92-321-1111111",
    isActive: true,
  });

  const hassanUser = await User.create({
    name: "Hassan Raza",
    email: "hassan@aiclinic.com",
    password: "Hassan@123",
    role: ROLES.PATIENT,
    phone: "+92-312-5555555",
    isActive: true,
  });

  console.log("👤 Created users: admin, 2 doctors, 1 receptionist, 2 patients");

  // ─── Patients ─────────────────────────────────────────
  const patientsData = [
    {
      name: "Muhammad Usman",
      age: 45,
      gender: "male",
      phone: "+92-321-1111111",
      email: "usman@example.com",
      bloodGroup: "B+",
      allergies: ["Penicillin"],
      chronicConditions: ["Hypertension", "Diabetes Type 2"],
      address: "House 12, Block A, Gulshan-e-Iqbal, Karachi",
      emergencyContact: { name: "Fatima Usman", phone: "+92-321-2222222", relation: "Wife" },
      createdBy: receptionist._id,
      userId: patientUser._id,
    },
    {
      name: "Zara Ahmed",
      age: 32,
      gender: "female",
      phone: "+92-331-3333333",
      email: "zara@example.com",
      bloodGroup: "A+",
      allergies: [],
      chronicConditions: ["Asthma"],
      address: "Flat 5B, DHA Phase 6, Lahore",
      emergencyContact: { name: "Bilal Ahmed", phone: "+92-331-4444444", relation: "Husband" },
      createdBy: receptionist._id,
    },
    {
      name: "Hassan Raza",
      age: 58,
      gender: "male",
      phone: "+92-312-5555555",
      email: "hassan@example.com",
      bloodGroup: "O-",
      allergies: ["Aspirin", "Sulfa drugs"],
      chronicConditions: ["Heart Disease", "Hypertension"],
      address: "Street 7, F-8/3, Islamabad",
      emergencyContact: { name: "Sana Hassan", phone: "+92-312-6666666", relation: "Daughter" },
      createdBy: admin._id,
      userId: hassanUser._id,
    },
    {
      name: "Ayesha Siddiqui",
      age: 28,
      gender: "female",
      phone: "+92-345-7777777",
      email: "ayesha@example.com",
      bloodGroup: "AB+",
      allergies: [],
      chronicConditions: [],
      address: "Bungalow 3, Clifton Block 5, Karachi",
      emergencyContact: { name: "Tariq Siddiqui", phone: "+92-345-8888888", relation: "Father" },
      createdBy: receptionist._id,
    },
    {
      name: "Khalid Mehmood",
      age: 52,
      gender: "male",
      phone: "+92-300-9999999",
      email: "khalid@example.com",
      bloodGroup: "B-",
      allergies: ["Latex"],
      chronicConditions: ["Diabetes Type 2", "Obesity"],
      address: "Model Town, Lahore",
      emergencyContact: { name: "Rukhsana Khalid", phone: "+92-300-0101010", relation: "Wife" },
      createdBy: receptionist._id,
    },
  ];

  const patients = await Patient.insertMany(patientsData);
  console.log(`🏥 Created ${patients.length} patients`);

  // ─── Appointments ─────────────────────────────────────
  const today = new Date();
  const dateOffset = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const appointmentsData = [
    // Today's appointments
    { patientId: patients[0]._id, doctorId: doctor1._id, date: dateOffset(0), timeSlot: "09:00", status: APPOINTMENT_STATUS.PENDING, reason: "Blood pressure checkup", createdBy: receptionist._id },
    { patientId: patients[1]._id, doctorId: doctor1._id, date: dateOffset(0), timeSlot: "10:00", status: APPOINTMENT_STATUS.CONFIRMED, reason: "Asthma follow-up", createdBy: receptionist._id },
    { patientId: patients[2]._id, doctorId: doctor2._id, date: dateOffset(0), timeSlot: "11:00", status: APPOINTMENT_STATUS.PENDING, reason: "Cardiac checkup", createdBy: receptionist._id },

    // Past completed appointments
    { patientId: patients[0]._id, doctorId: doctor1._id, date: dateOffset(-7), timeSlot: "09:00", status: APPOINTMENT_STATUS.COMPLETED, reason: "Diabetes management", notes: "HbA1c elevated, adjusted medication", createdBy: receptionist._id },
    { patientId: patients[1]._id, doctorId: doctor1._id, date: dateOffset(-14), timeSlot: "10:00", status: APPOINTMENT_STATUS.COMPLETED, reason: "Routine checkup", createdBy: receptionist._id },
    { patientId: patients[2]._id, doctorId: doctor2._id, date: dateOffset(-5), timeSlot: "14:00", status: APPOINTMENT_STATUS.COMPLETED, reason: "Post-surgery follow-up", createdBy: admin._id },
    { patientId: patients[3]._id, doctorId: doctor1._id, date: dateOffset(-3), timeSlot: "11:00", status: APPOINTMENT_STATUS.COMPLETED, reason: "Fever and cold", createdBy: receptionist._id },
    { patientId: patients[4]._id, doctorId: doctor1._id, date: dateOffset(-10), timeSlot: "15:00", status: APPOINTMENT_STATUS.COMPLETED, reason: "Weight management consultation", createdBy: receptionist._id },

    // Upcoming appointments
    { patientId: patients[3]._id, doctorId: doctor1._id, date: dateOffset(2), timeSlot: "09:00", status: APPOINTMENT_STATUS.CONFIRMED, reason: "Follow-up visit", createdBy: receptionist._id },
    { patientId: patients[4]._id, doctorId: doctor2._id, date: dateOffset(3), timeSlot: "10:00", status: APPOINTMENT_STATUS.PENDING, reason: "Diabetes review", createdBy: receptionist._id },
  ];

  const appointments = await Appointment.insertMany(appointmentsData);
  console.log(`📅 Created ${appointments.length} appointments`);

  // ─── Prescriptions ────────────────────────────────────
  // Link prescriptions to completed appointments
  const completedAppts = appointmentsData.filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED);

  const prescriptionsData = [
    {
      patientId: patients[0]._id,
      doctorId: doctor1._id,
      appointmentId: appointments[3]._id,
      diagnosis: "Type 2 Diabetes Mellitus — Uncontrolled",
      medicines: [
        { name: "Metformin", dosage: "1000mg", frequency: "Twice daily", duration: "3 months", instructions: "Take with meals" },
        { name: "Glimepiride", dosage: "2mg", frequency: "Once daily (morning)", duration: "3 months", instructions: "Before breakfast" },
        { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily (night)", duration: "3 months" },
      ],
      notes: "Patient HbA1c is 9.2%. Strict diet control advised. Avoid sugar. Walk 30 mins daily.",
      followUpDate: dateOffset(30),
    },
    {
      patientId: patients[1]._id,
      doctorId: doctor1._id,
      appointmentId: appointments[4]._id,
      diagnosis: "Bronchial Asthma — Mild Persistent",
      medicines: [
        { name: "Salbutamol Inhaler", dosage: "100mcg/puff", frequency: "As needed (2 puffs)", duration: "As required", instructions: "Shake well before use" },
        { name: "Fluticasone Inhaler", dosage: "250mcg/puff", frequency: "Twice daily", duration: "2 months", instructions: "Rinse mouth after use" },
        { name: "Montelukast", dosage: "10mg", frequency: "Once daily at night", duration: "2 months" },
      ],
      notes: "Avoid dust and cold air. Use inhaler 15 mins before exercise.",
      followUpDate: dateOffset(45),
    },
    {
      patientId: patients[2]._id,
      doctorId: doctor2._id,
      appointmentId: appointments[5]._id,
      diagnosis: "Hypertensive Heart Disease with Stable Angina",
      medicines: [
        { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "Ongoing", instructions: "Morning" },
        { name: "Bisoprolol", dosage: "5mg", frequency: "Once daily", duration: "Ongoing", instructions: "Morning with food" },
        { name: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "Ongoing", instructions: "With dinner" },
        { name: "Isosorbide Mononitrate", dosage: "20mg", frequency: "Twice daily", duration: "1 month", instructions: "For angina attacks" },
      ],
      notes: "Avoid strenuous activity. Salt restriction strictly advised. BP target <130/80.",
      followUpDate: dateOffset(14),
    },
    {
      patientId: patients[3]._id,
      doctorId: doctor1._id,
      appointmentId: appointments[6]._id,
      diagnosis: "Upper Respiratory Tract Infection (URTI)",
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", duration: "7 days", instructions: "Complete the full course" },
        { name: "Paracetamol", dosage: "500mg", frequency: "Every 6 hours if fever", duration: "As needed" },
        { name: "Cetirizine", dosage: "10mg", frequency: "Once daily at night", duration: "7 days" },
        { name: "Saline Nasal Drops", dosage: "2-3 drops each nostril", frequency: "Three times daily", duration: "5 days" },
      ],
      notes: "Rest, plenty of fluids. Return if fever persists more than 3 days.",
    },
    {
      patientId: patients[4]._id,
      doctorId: doctor1._id,
      appointmentId: appointments[7]._id,
      diagnosis: "Type 2 Diabetes with Obesity",
      medicines: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "3 months", instructions: "With meals" },
        { name: "Sitagliptin", dosage: "100mg", frequency: "Once daily", duration: "3 months" },
        { name: "Orlistat", dosage: "120mg", frequency: "Three times daily with meals", duration: "3 months" },
      ],
      notes: "Calorie-restricted diet (1800 kcal/day). Daily exercise minimum 45 mins. Target weight loss 5kg in 3 months.",
      followUpDate: dateOffset(90),
    },
  ];

  await Prescription.insertMany(prescriptionsData);
  console.log(`💊 Created ${prescriptionsData.length} prescriptions`);

  // ─── Summary ──────────────────────────────────────────
  console.log("\n✅ Seed completed successfully!\n");
  console.log("─────────────────────────────────────────");
  console.log("📋 Login Credentials:");
  console.log("─────────────────────────────────────────");
  console.log("🔑 Admin (Pro):     admin@aiclinic.com     / Admin@123");
  console.log("🩺 Doctor 1 (Pro):  sarah.khan@aiclinic.com / Doctor@123");
  console.log("🩺 Doctor 2 (Free): ahmed.ali@aiclinic.com  / Doctor@123");
  console.log("🗓️  Receptionist:   aisha@aiclinic.com      / Recept@123");
  console.log("─────────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
