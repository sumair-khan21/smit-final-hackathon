const Appointment = require("../models/appointment.model");
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, ROLES, APPOINTMENT_STATUS } = require("../constants");

class AppointmentService {
  /**
   * Create appointment (with conflict check)
   */
  async createAppointment(data, createdBy) {
    // Check for existing non-cancelled appointment in same slot
    const conflict = await Appointment.findOne({
      doctorId: data.doctorId,
      date: new Date(data.date),
      timeSlot: data.timeSlot,
      status: { $nin: [APPOINTMENT_STATUS.CANCELLED] },
    });

    if (conflict) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "This time slot is already booked for the selected doctor");
    }

    const appointment = await Appointment.create({ ...data, date: new Date(data.date), createdBy });
    return appointment.populate(["patientId", { path: "doctorId", select: "name specialization" }]);
  }

  /**
   * Get all appointments (filtered by role)
   */
  async getAllAppointments(query = {}, userRole, userId) {
    const { page = 1, limit = 10, status = "", date = "", sort = "-date" } = query;

    const filter = {};

    // Role-based filtering
    if (userRole === ROLES.DOCTOR) {
      filter.doctorId = userId;
    } else if (userRole === ROLES.PATIENT) {
      // patient sees their own via patientId linked to userId - handled differently
      // For now, patients see nothing here (they use patient detail page)
      filter._id = null;
    }

    if (status) filter.status = status;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .populate("patientId", "name phone age gender")
      .populate("doctorId", "name specialization")
      .populate("createdBy", "name")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    return {
      appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  /**
   * Get appointment by ID
   */
  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findById(appointmentId)
      .populate("patientId", "name phone age gender bloodGroup")
      .populate("doctorId", "name specialization email")
      .populate("createdBy", "name");

    if (!appointment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
    }

    return appointment;
  }

  /**
   * Update appointment
   */
  async updateAppointment(appointmentId, updateData) {
    if (updateData.date) updateData.date = new Date(updateData.date);

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("patientId", "name phone").populate("doctorId", "name specialization");

    if (!appointment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
    }

    return appointment;
  }

  /**
   * Update appointment status
   */
  async updateStatus(appointmentId, status, notes) {
    const updateData = { status };
    if (notes) updateData.notes = notes;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateData },
      { new: true }
    ).populate("patientId", "name").populate("doctorId", "name");

    if (!appointment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
    }

    return appointment;
  }

  /**
   * Get doctor's booked time slots for a specific date
   */
  async getDoctorSchedule(doctorId, date) {
    if (!date) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Date is required");

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: start, $lte: end },
      status: { $nin: [APPOINTMENT_STATUS.CANCELLED] },
    })
      .populate("patientId", "name phone")
      .sort("timeSlot");

    return appointments;
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(appointmentId) {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: APPOINTMENT_STATUS.CANCELLED },
      { new: true }
    );

    if (!appointment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
    }

    return appointment;
  }
}

module.exports = new AppointmentService();
