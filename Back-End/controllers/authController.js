const authService = require("../services/authService");

exports.register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const result = await authService.verifyOTP(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.resendOTP = async (req, res, next) => {
    try {
        const result = await authService.resendOTP(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.forgotpassword = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const result = await authService.resetPassword(req.body);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const result = await authService.getMe(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const result = await authService.logout(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};