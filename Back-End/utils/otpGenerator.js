const otpGenerator = require("otp-generator");
const dotenv = require("dotenv").config();

// Config
const OTP_LENGTH = process.env.OTP_LENGTH ?? 4;
const OTP_EXPIRES_IN = process.env.OTP_EXPIRES_IN ?? "10m";

// Generate OTP
exports.generateOTP = function () {
    return otpGenerator.generate(OTP_LENGTH, { upperCase: false, specialChars: false });
};