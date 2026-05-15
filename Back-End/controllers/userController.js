const userService = require('../services/userService');

exports.followUser = async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const result = await userService.followUser(req.params.id, req.user.id, io);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.unfollowUser = async (req, res, next) => {
    try {
        const result = await userService.unfollowUser(req.params.id, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getFollowers = async (req, res, next) => {
    try {
        const result = await userService.getFollowers(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getFollowing = async (req, res, next) => {
    try {
        const result = await userService.getFollowing(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
    try {
        const result = await userService.getUserProfile(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.updateMyProfile = async (req, res, next) => {
    try {
        const result = await userService.updateMyProfile(req.user.id, req.body, req.file);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMyFollowers = async (req, res, next) => {
    try {
        const result = await userService.getFollowers(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
exports.getMyFollowing = async (req, res, next) => {
    try {
        const result = await userService.getFollowing(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.searchUsers = async (req, res, next) => {
    try {
        const result = await userService.searchUsers(req.query.q, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};