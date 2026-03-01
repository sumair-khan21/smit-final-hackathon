const ApiError = require("../utils/ApiError");
const { HTTP_STATUS, SUBSCRIPTION_PLANS } = require("../constants");

/**
 * Middleware to restrict access to Pro plan users only
 */
const requirePro = (req, _res, next) => {
  if (req.user.subscriptionPlan !== SUBSCRIPTION_PLANS.PRO) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "This feature requires a Pro subscription. Please upgrade to access this feature."
    );
  }
  next();
};

module.exports = { requirePro };
