const { Router } = require("express");
const { runSymptomChecker, prescriptionExplanation, riskFlagging, getDiagnosisLogs, getDiagnosisLogById } = require("../controllers/ai.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { requirePro } = require("../middlewares/subscription.middleware");
const validate = require("../middlewares/validate.middleware");
const { symptomCheckerSchema, prescriptionExplainSchema, riskFlagSchema } = require("../validators/ai.validator");
const { ROLES } = require("../constants");

const router = Router();

router.use(authenticate);

router.post("/symptom-check", authorize(ROLES.DOCTOR), validate(symptomCheckerSchema), runSymptomChecker);
router.post("/prescription-explain", authorize(ROLES.DOCTOR, ROLES.PATIENT), validate(prescriptionExplainSchema), prescriptionExplanation);
router.post("/risk-flag/:patientId", authorize(ROLES.DOCTOR), requirePro, validate(riskFlagSchema), riskFlagging);
router.get("/logs", authorize(ROLES.DOCTOR, ROLES.ADMIN), getDiagnosisLogs);
router.get("/logs/:id", getDiagnosisLogById);

module.exports = router;
