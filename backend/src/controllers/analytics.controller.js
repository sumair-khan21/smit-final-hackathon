const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const analyticsService = require("../services/analytics.service");
const { HTTP_STATUS } = require("../constants");

const getAdminAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAdminAnalytics();
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, "Admin analytics fetched"));
});

const getDoctorAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDoctorAnalytics(req.user._id);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, data, "Doctor analytics fetched"));
});

module.exports = { getAdminAnalytics, getDoctorAnalytics };
