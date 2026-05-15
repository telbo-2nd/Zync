const notificationService = require('../services/notificationService');

exports.getMyNotifications = async (req, res, next) => {
    try {
        const result = await notificationService.getMyNotifications(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.markAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAsRead(req.params.id, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.markAllAsRead = async (req, res, next) => {
    try {
        const result = await notificationService.markAllAsRead(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};