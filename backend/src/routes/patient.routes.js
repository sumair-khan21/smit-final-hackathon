const { Router } = require("express");
const {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientHistory,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createPatientSchema, updatePatientSchema } = require("../validators/patient.validator");
const { ROLES } = require("../constants");

const router = Router();

router.use(authenticate);

router.post("/", authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), validate(createPatientSchema), createPatient);
router.get("/", authorize(ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST), getAllPatients);
router.get("/:id", getPatientById);
router.get("/:id/history", getPatientHistory);
router.patch("/:id", authorize(ROLES.ADMIN, ROLES.RECEPTIONIST), validate(updatePatientSchema), updatePatient);
router.delete("/:id", authorize(ROLES.ADMIN), deletePatient);

module.exports = router;
