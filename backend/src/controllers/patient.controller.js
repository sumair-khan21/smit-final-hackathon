const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const patientService = require("../services/patient.service");
const { HTTP_STATUS, ROLES } = require("../constants");

// @desc    Create patient
// @route   POST /api/v1/patients
// @access  Admin, Receptionist
const createPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.createPatient(req.body, req.user._id);

  res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, { patient }, "Patient created successfully"));
});

// @desc    Get all patients
// @route   GET /api/v1/patients
// @access  Admin, Doctor, Receptionist
const getAllPatients = asyncHandler(async (req, res) => {
  const result = await patientService.getAllPatients(req.query);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, "Patients fetched successfully"));
});

// @desc    Get patient by ID
// @route   GET /api/v1/patients/:id
// @access  Authenticated (patients: own only)
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.id);

  // Patient role: can only view their own record
  if (req.user.role === ROLES.PATIENT) {
    const userId = req.user._id.toString();
    if (!patient.userId || patient.userId.toString() !== userId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Access denied. You can only view your own record.");
    }
  }

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { patient }, "Patient fetched successfully"));
});

// @desc    Get patient medical history timeline
// @route   GET /api/v1/patients/:id/history
// @access  Authenticated (patients: own only)
const getPatientHistory = asyncHandler(async (req, res) => {
  // Patient role check done in service or here
  const result = await patientService.getPatientHistory(req.params.id);

  if (req.user.role === ROLES.PATIENT) {
    const userId = req.user._id.toString();
    if (!result.patient.userId || result.patient.userId.toString() !== userId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Access denied.");
    }
  }

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, result, "Patient history fetched successfully"));
});

// @desc    Update patient
// @route   PATCH /api/v1/patients/:id
// @access  Admin, Receptionist
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { patient }, "Patient updated successfully"));
});

// @desc    Delete patient
// @route   DELETE /api/v1/patients/:id
// @access  Admin
const deletePatient = asyncHandler(async (req, res) => {
  await patientService.deletePatient(req.params.id);

  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, "Patient deleted successfully"));
});

module.exports = { createPatient, getAllPatients, getPatientById, getPatientHistory, updatePatient, deletePatient };
