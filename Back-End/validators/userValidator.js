const JOI = require('joi');

exports.followUnfollowSchema = JOI.object({
    id: JOI.string().uuid().required()
});

exports.getUserProfileSchema = JOI.object({
    id: JOI.string().uuid().required()
});

exports.getFollowersFollowingSchema = JOI.object({
    id: JOI.string().uuid().required()
});

exports.updateMyProfileSchema = JOI.object({
    firstname: JOI.string().trim().max(50).optional(),
    lastname: JOI.string().trim().max(50).optional(),
    username: JOI.string().alphanum().min(3).max(20).optional(),
    bio: JOI.string().trim().max(160).optional(),
    phone: JOI.string().trim().min(11).max(11).optional(),
    password: JOI.string().trim().min(6).optional(),
});