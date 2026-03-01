const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const appointmentService = require("../services/appointment.service");
const { HTTP_STATUS } = require("../constants");

// @desc    Create appointment
// @route   POST /api/v1/appointments
// @access  Admin, Receptionist
const createAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body, req.user._id);

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, { appointment }, "Appointment created successfully"));
});

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Authenticated (filtered by role)
const getAllAppointments = asyncHandler(async (req, res) => {
  const result = await appointmentService.getAllAppointments(req.query, req.user.role, req.user._id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, "Appointments fetched successfully"));
});

// @desc    Get appointment by ID
// @route   GET /api/v1/appointments/:id
// @access  Authenticated
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { appointment }, "Appointment fetched successfully"));
});

// @desc    Update appointment
// @route   PATCH /api/v1/appointments/:id
// @access  Admin, Receptionist
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateAppointment(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { appointment }, "Appointment updated successfully"));
});

// @desc    Update appointment status
// @route   PATCH /api/v1/appointments/:id/status
// @access  Admin, Doctor, Receptionist
const updateStatus = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateStatus(req.params.id, req.body.status, req.body.notes);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { appointment }, "Appointment status updated"));
});

// @desc    Get doctor's schedule for a date
// @route   GET /api/v1/appointments/doctor/:doctorId/schedule
// @access  Authenticated
const getDoctorSchedule = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.getDoctorSchedule(req.params.doctorId, req.query.date);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { appointments }, "Doctor schedule fetched successfully"));
});

// @desc    Cancel appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Admin, Receptionist
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { appointment }, "Appointment cancelled successfully"));
});

module.exports = { createAppointment, getAllAppointments, getAppointmentById, updateAppointment, updateStatus, getDoctorSchedule, cancelAppointment };
