const { Router } = require("express");
const { getAdminAnalytics, getDoctorAnalytics } = require("../controllers/analytics.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants");

const router = Router();

router.use(authenticate);

router.get("/admin", authorize(ROLES.ADMIN), getAdminAnalytics);
router.get("/doctor", authorize(ROLES.DOCTOR), getDoctorAnalytics);

module.exports = router;
