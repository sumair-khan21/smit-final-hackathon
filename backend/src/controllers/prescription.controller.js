const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const prescriptionService = require("../services/prescription.service");
const { HTTP_STATUS } = require("../constants");

const createPrescription = asyncHandler(async (req, res) => {
  const prescription = await prescriptionService.createPrescription(req.body, req.user._id);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, { prescription }, "Prescription created successfully"));
});

const getAllPrescriptions = asyncHandler(async (req, res) => {
  const result = await prescriptionService.getAllPrescriptions(req.query, req.user.role, req.user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Prescriptions fetched successfully"));
});

const getPrescriptionById = asyncHandler(async (req, res) => {
  const prescription = await prescriptionService.getPrescriptionById(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { prescription }, "Prescription fetched successfully"));
});

const getPrescriptionsByPatient = asyncHandler(async (req, res) => {
  const prescriptions = await prescriptionService.getPrescriptionsByPatient(req.params.patientId);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { prescriptions }, "Prescriptions fetched successfully"));
});

const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await prescriptionService.updatePrescription(req.params.id, req.body, req.user.role, req.user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { prescription }, "Prescription updated successfully"));
});

module.exports = { createPrescription, getAllPrescriptions, getPrescriptionById, getPrescriptionsByPatient, updatePrescription };
