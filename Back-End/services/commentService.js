const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const AppError = require('../utils/appError');
const { createCommentSchema } = require('../validators/commentValidator');
const { createNotification } = require('./notificationService');

exports.createComment = async function (postId, userId, body, io) {

    const { error, value } = createCommentSchema.validate(body);
    if (error) throw new AppError(error.details[0].message, 400);

    const post = await Post.findByPk(postId);
    if (!post) throw new AppError('Post not found', 404);

    const comment = await Comment.create({
        userId,
        postId,
        content: value.content,
        parentId: null
    });

    await post.increment('commentsCount');

    // send notification to post owner (if not commenting on own post)
    await createNotification(io, {
        userId: post.userId,   // post owner
        senderId: userId,      // comment author
        type: 'comment',
        postId: post.id
    });

    return {
        success: true,
        message: 'Comment created successfully',
        data: comment
    };
};



exports.deleteComment = async function (postId, commentId, userId) {

    const post = await Post.findByPk(postId);
    if (!post) throw new AppError('Post not found', 404);

    const comment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!comment) throw new AppError('Comment not found', 404);

    if (comment.userId !== userId && post.userId !== userId) {
        throw new AppError('Unauthorized', 403);
    }

    await Comment.destroy({ where: { parentId: commentId } });
    await comment.destroy();
    await post.decrement('commentsCount');

    return {
        success: true,
        message: 'Comment deleted successfully'
    };
};


exports.replyComment = async function (postId, commentId, userId, body, io) {

    const { error, value } = createCommentSchema.validate(body);
    if (error) throw new AppError(error.details[0].message, 400);

    const post = await Post.findByPk(postId);
    if (!post) throw new AppError('Post not found', 404);

    const parentComment = await Comment.findOne({ where: { id: commentId, postId } });
    if (!parentComment) throw new AppError('Comment not found', 404);

    if (parentComment.parentId !== null) {
        throw new AppError('Cannot reply to a reply', 400);
    }

    const reply = await Comment.create({
        userId,
        postId,
        content: value.content,
        parentId: commentId
    });

    await post.increment('commentsCount');

    // send notification to the owner of the parent comment (if not replying to own comment)
    await createNotification(io, {
        userId: parentComment.userId, 
        senderId: userId,       // reply author
        type: 'comment',     
        postId: post.id
    });

    return {
        success: true,
        message: 'Reply created successfully',
        data: reply
    };
};