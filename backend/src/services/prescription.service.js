const Prescription = require("../models/prescription.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES } = require("../constants");

class PrescriptionService {
  async createPrescription(data, doctorId) {
    if (data.followUpDate) data.followUpDate = new Date(data.followUpDate);

    const prescription = await Prescription.create({ ...data, doctorId });

    // Mark appointment as completed if linked
    if (data.appointmentId) {
      const Appointment = require("../models/appointment.model");
      await Appointment.findByIdAndUpdate(data.appointmentId, { status: "completed" });
    }

    return prescription.populate([
      { path: "patientId", select: "name phone age gender" },
      { path: "doctorId", select: "name specialization" },
    ]);
  }

  async getAllPrescriptions(query = {}, userRole, userId) {
    const { page = 1, limit = 10, sort = "-createdAt" } = query;
    const filter = {};

    if (userRole === ROLES.DOCTOR) filter.doctorId = userId;
    else if (userRole === ROLES.PATIENT) {
      // patients see their own via patientId linked — handled by patient detail
      filter._id = null;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Prescription.countDocuments(filter);
    const prescriptions = await Prescription.find(filter)
      .populate("patientId", "name phone")
      .populate("doctorId", "name specialization")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    return {
      prescriptions,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    };
  }

  async getPrescriptionById(id) {
    const prescription = await Prescription.findById(id)
      .populate("patientId", "name phone age gender bloodGroup allergies")
      .populate("doctorId", "name specialization email phone")
      .populate("appointmentId", "date timeSlot");

    if (!prescription) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
    return prescription;
  }

  async getPrescriptionsByPatient(patientId) {
    return Prescription.find({ patientId })
      .populate("doctorId", "name specialization")
      .sort("-createdAt");
  }

  async updatePrescription(id, data, userRole, userId) {
    const prescription = await Prescription.findById(id);
    if (!prescription) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");

    if (userRole === ROLES.DOCTOR && prescription.doctorId.toString() !== userId.toString()) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "You can only edit your own prescriptions");
    }

    if (data.followUpDate) data.followUpDate = new Date(data.followUpDate);

    return Prescription.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .populate("patientId", "name phone")
      .populate("doctorId", "name specialization");
  }
}

module.exports = new PrescriptionService();
