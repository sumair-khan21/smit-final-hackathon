const { Router } = require("express");
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  updateStatus,
  getDoctorSchedule,
  cancelAppointment,
} = require("../controllers/appointment.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createAppointmentSchema, updateAppointmentSchema, updateStatusSchema } = require("../validators/appointment.validator");
const { ROLES } = require("../constants");

const router = Router();

router.use(authenticate);

router.post("/", authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), validate(createAppointmentSchema), createAppointment);
router.get("/", getAllAppointments);
router.get("/doctor/:doctorId/schedule", getDoctorSchedule);
router.get("/:id", getAppointmentById);
router.patch("/:id", authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), validate(updateAppointmentSchema), updateAppointment);
router.patch("/:id/status", authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST), validate(updateStatusSchema), updateStatus);
router.delete("/:id", authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), cancelAppointment);

module.exports = router;
