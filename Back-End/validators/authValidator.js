// Req Joi
const Joi = require("joi");
const dotenv = require("dotenv").config();

// Register Schema
exports.registerSchema = Joi.object({
    firstname: Joi.string().trim().max(50).required(),

    lastname: Joi.string().trim().max(50).required(),

    username: Joi.string().alphanum().min(3).max(20).required(),

    email: Joi.string().email().trim().lowercase().required(),

    phone: Joi.string().trim().min(11).max(11).required(),

    password: Joi.string().trim().min(6).required(),

});

// Login Schema
exports.loginSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),

    password: Joi.string().trim().min(6).required(),
});

// verify OTP Schema
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH) || 4;

exports.verifyOTPSchema = Joi.object({
    //here
    email: Joi.string().email().trim().lowercase().required(),
    otp: Joi.string().length(OTP_LENGTH).required(),
});

// Resend OTP Schema
exports.resendOTPSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
});

// Forgot Password Schema
exports.forgotPasswordSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
});

exports.forgotPasswordResendOTPSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
});

// Reset Password Schema
exports.resetPasswordSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    //here
    otp: Joi.string().length(OTP_LENGTH).required(),
    newPassword: Joi.string().trim().min(6).required(),
});