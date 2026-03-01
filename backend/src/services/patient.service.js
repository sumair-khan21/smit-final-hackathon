const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES } = require("../constants");

class PatientService {
  /**
   * Create a new patient
   */
  async createPatient(data, createdBy) {
    const patient = await Patient.create({ ...data, createdBy });
    return patient;
  }

  /**
   * Get all patients with pagination + search
   */
  async getAllPatients(query = {}) {
    const { page = 1, limit = 10, search = "", sort = "-createdAt" } = query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Patient.countDocuments(filter);
    const patients = await Patient.find(filter)
      .populate("createdBy", "name role")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    return {
      patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  /**
   * Get patient by ID
   */
  async getPatientById(patientId) {
    const patient = await Patient.findById(patientId)
      .populate("createdBy", "name role")
      .populate("userId", "name email");

    if (!patient || !patient.isActive) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return patient;
  }

  /**
   * Update patient
   */
  async updatePatient(patientId, updateData) {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return patient;
  }

  /**
   * Delete patient (soft delete)
   */
  async deletePatient(patientId) {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { isActive: false },
      { new: true }
    );

    if (!patient) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    return { message: "Patient deleted successfully" };
  }

  /**
   * Get patient full medical history (timeline)
   * Aggregates appointments, prescriptions, and diagnosis logs
   */
  async getPatientHistory(patientId) {
    const patient = await Patient.findById(patientId);
    if (!patient || !patient.isActive) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Patient not found");
    }

    const Appointment = require("../models/appointment.model");
    const Prescription = require("../models/prescription.model");
    const DiagnosisLog = require("../models/diagnosisLog.model");

    const [appointments, prescriptions, diagnoses] = await Promise.all([
      Appointment.find({ patientId }).populate("doctorId", "name specialization").sort("-date").lean(),
      Prescription.find({ patientId }).populate("doctorId", "name").sort("-createdAt").lean(),
      DiagnosisLog.find({ patientId }).populate("doctorId", "name").sort("-createdAt").lean(),
    ]);

    // Tag each entry with its type and normalize date
    const timeline = [
      ...appointments.map((a) => ({ ...a, type: "appointment", date: a.date || a.createdAt })),
      ...prescriptions.map((p) => ({ ...p, type: "prescription", date: p.createdAt })),
      ...diagnoses.map((d) => ({ ...d, type: "diagnosis", date: d.createdAt })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return { patient, timeline };
  }
}

module.exports = new PatientService();
