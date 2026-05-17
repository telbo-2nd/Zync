// Router
const router = require("express").Router();

// Controller
const authController = require("../controllers/authController");

// Middleware
const {authMiddleware} = require("../middleWares/authMiddleWare");

// Login
router.post("/login", authController.login);

// Register
router.post("/register", authController.register);

//verify OTP
router.post("/verify-otp", authController.verifyOTP);

// Resend OTP
router.post("/resend-otp", authController.resendOTP);

// Forgot Password
router.post("/forgot-password", authController.forgotpassword);


// Reset Password
router.post("/reset-password", authController.resetPassword);

// Logout
router.post("/logout", authMiddleware, authController.logout);

// Get Me
router.get("/me", authMiddleware , authController.getMe);

// Export
module.exports = router;