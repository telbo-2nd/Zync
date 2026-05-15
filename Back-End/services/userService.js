const { Post } = require('../models');
const Follow = require('../models/followModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const userValidator = require('../validators/userValidator');
const { createNotification } = require('./notificationService');
const { Op } = require('sequelize');

exports.followUser = async function (followedId, followerId, io) {
    // 1. INPUT VALIDATION
    const { error } = userValidator.followUnfollowSchema.validate({ id: followedId });
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    //2. CHECK IF USER IS TRYING TO FOLLOW THEMSELVES
    if (followerId === followedId) {
        throw new AppError("You cannot follow yourself", 400);
    }
    // 3. CHECK IF FOLLOWED USER EXISTS
    const followedUser = await User.findByPk(followedId);
    if (!followedUser) {
        throw new AppError("User not found", 404);
    }
    // 4. CHECK IF FOLLOWER ALREADY FOLLOWED THE FOLLOWED USER
    const follow = await Follow.findOne({ where: { followerId, followedId } });
    if (follow) {
        throw new AppError("You are already following this user", 400);
    }
    // 5. CREATE FOLLOW RELATIONSHIP
    await Follow.create({ followerId, followedId });
    await createNotification(io, {
        userId: followedId ,
        senderId: followerId, 
        type: 'follow'
    });
    return {
        success: true,
        message: `You are now following ${followedUser.username}`,
    };

}

exports.unfollowUser = async function (followedId, followerId) {

    // 1. INPUT VALIDATION
    const { error } = userValidator.followUnfollowSchema.validate({ id: followedId });
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    //2. CHECK IF USER IS TRYING TO unFOLLOW THEMSELVES
    if (followerId === followedId) {
        throw new AppError("You cannot unfollow yourself", 400);
    }
    // 3. CHECK IF FOLLOWED USER EXISTS
    const followedUser = await User.findByPk(followedId);
    if (!followedUser) {
        throw new AppError("User not found", 404);
    }
    // 4. CHECK IF FOLLOWER ALREADY FOLLOWED THE FOLLOWED USER
    const follow = await Follow.findOne({ where: { followerId, followedId } });
    if (!follow) {
        throw new AppError("You are not following this user", 400);
    }
    // 5. CREATE FOLLOW RELATIONSHIP
    await Follow.destroy({ where: { followerId, followedId } });
    return {
        success: true,
        message: `You are no longer following ${followedUser.username}`,
    };
}
exports.getFollowers = async function (userId) {
    // 1. Validate
    console.log(userId);
    const { error } = userValidator.getFollowersFollowingSchema.validate({ id: userId });
    if (error) throw new AppError(error.details[0].message, 400);

    // 2. Check if user exists
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User not found', 404);

    // 3. Get followers
    const followers = await Follow.findAll({
        where: { followedId: userId },
        include: [{
            model: User,
            as: 'follower',
            attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture']
        }]
    });

    return {
        success: true,
        count: followers.length,
        data: followers.map(f => f.follower)
    };
};

exports.getFollowing = async function (userId) {
    // 1. Validate
    const { error } = userValidator.getFollowersFollowingSchema.validate({ id: userId });
    if (error) throw new AppError(error.details[0].message, 400);

    // 2. Check if user exists
    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User not found', 404);

    // 3. Get following
    const following = await Follow.findAll({
        where: { followerId: userId },
        include: [{
            model: User,
            as: 'followed',
            attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture']
        }]
    });

    return {
        success: true,
        count: following.length,
        data: following.map(f => f.followed)
    };
};
//TODO : get the profile including the public & friends-only posts of the user
exports.getUserProfile = async function (userId) {
    // 1. Validate
    const { error } = userValidator.getUserProfileSchema.validate({ id: userId });
    if (error) throw new AppError(error.details[0].message, 400);

    // 2. Get user profile
    const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture', 'bio', 'createdAt'],
    });
    if (!user) throw new AppError('User not found', 404);

    // 3. Get followers & following count
    const followersCount = await Follow.count({ where: { followedId: userId } });
    const followingCount = await Follow.count({ where: { followerId: userId } });
    const postsCount = await Post.count({ where: { userId } });

    return {
        success: true,
        data: {
            ...user.toJSON(),
            followersCount,
            followingCount,
            postsCount
        }
    };
};

exports.updateMyProfile = async function (userId, profileData, file) {

    const { error, value } = userValidator.updateMyProfileSchema.validate(profileData);
    if (error) throw new AppError(error.details[0].message, 400);

    const user = await User.findByPk(userId);
    if (!user) throw new AppError('User not found', 404);

    // Handle profile picture update
    if (file) {
        // Delete old profile picture if it exists
        if (user.profilePicture && fs.existsSync(user.profilePicture)) {
            fs.unlinkSync(user.profilePicture);
        }
        value.profilePicture = file.path.replace(/\\/g, '/');
    }

    if (value.username && value.username !== user.username) {
        const usernameExists = await User.findOne({ where: { username: value.username } });
        if (usernameExists) throw new AppError('Username already in use', 400);
    }

    await user.update(value);

    return {
        success: true,
        message: 'Profile updated successfully',
        data: {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            profilePicture: user.profilePicture,
            bio: user.bio
        }
    };
};

exports.searchUsers = async function (query, currentUserId) {
    if (!query) return { success: true, data: [] };

    const users = await User.findAll({
        where: {
            [Op.and]: [
                { id: { [Op.ne]: currentUserId } },
                {
                    [Op.or]: [
                        { username: { [Op.like]: `%${query}%` } },
                        { firstname: { [Op.like]: `%${query}%` } },
                        { lastname: { [Op.like]: `%${query}%` } },
                    ]
                }
            ]
        },
        attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture', 'bio'],
        limit: 10
    });

    return { success: true, data: users };
};