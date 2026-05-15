const { Like, Post } = require('../models');
const AppError = require('../utils/appError');
const { createNotification } = require('./notificationService');

exports.toggleLike = async function (postId, userId, io) {

    // 1. Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) throw new AppError('Post not found', 404);

    // 2. Check if already liked
    const existingLike = await Like.findOne({ where: { userId, postId } });

    if (existingLike) {
        // Unlike
        await existingLike.destroy();
        await post.decrement('likesCount');
        return {
            success: true,
            message: 'Post unliked successfully',
            liked: false,
            likesCount: post.likesCount - 1
        };
    } else {
        // Like
        await Like.create({ userId, postId });
        await post.increment('likesCount');
        // Create notification for post owner (if not liking own post)
        await createNotification(io, {
            userId: post.userId,   
            senderId: userId,      
            type: 'like',
            postId: post.id
        });

        return {
            success: true,
            message: 'Post liked successfully',
            liked: true,
            likesCount: post.likesCount + 1
        };
    }
};