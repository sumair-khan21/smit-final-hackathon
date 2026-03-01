const { Router } = require("express");
const { createPrescription, getAllPrescriptions, getPrescriptionById, getPrescriptionsByPatient, updatePrescription } = require("../controllers/prescription.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createPrescriptionSchema, updatePrescriptionSchema } = require("../validators/prescription.validator");
const { ROLES } = require("../constants");

const router = Router();

router.use(authenticate);

router.post("/", authorize(ROLES.DOCTOR), validate(createPrescriptionSchema), createPrescription);
router.get("/", getAllPrescriptions);
router.get("/patient/:patientId", getPrescriptionsByPatient);
router.get("/:id", getPrescriptionById);
router.patch("/:id", authorize(ROLES.DOCTOR, ROLES.ADMIN), validate(updatePrescriptionSchema), updatePrescription);

module.exports = router;
