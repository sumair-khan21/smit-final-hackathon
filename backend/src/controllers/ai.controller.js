const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const aiService = require("../services/ai.service");
const { HTTP_STATUS } = require("../constants");

const runSymptomChecker = asyncHandler(async (req, res) => {
  const result = await aiService.symptomChecker(req.body, req.user._id);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, result, result.aiFailed ? "AI unavailable — log saved" : "Symptom check completed")
  );
});

const prescriptionExplanation = asyncHandler(async (req, res) => {
  const result = await aiService.prescriptionExplanation(req.body, req.user._id);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, result, result.aiFailed ? "AI unavailable" : "Prescription explanation generated")
  );
});

const riskFlagging = asyncHandler(async (req, res) => {
  const result = await aiService.riskFlagging(req.params.patientId, req.user._id);
  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(HTTP_STATUS.OK, result, result.aiFailed ? "AI unavailable" : "Risk analysis completed")
  );
});

const getDiagnosisLogs = asyncHandler(async (req, res) => {
  const result = await aiService.getDiagnosisLogs(req.query, req.user.role, req.user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result, "Diagnosis logs fetched"));
});

const getDiagnosisLogById = asyncHandler(async (req, res) => {
  const log = await aiService.getDiagnosisLogById(req.params.id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { log }, "Diagnosis log fetched"));
});

module.exports = { runSymptomChecker, prescriptionExplanation, riskFlagging, getDiagnosisLogs, getDiagnosisLogById };
