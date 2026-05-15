const commentService = require('../services/commentService');

exports.createComment = async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const result = await commentService.createComment(req.params.postId, req.user.id, req.body, io);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteComment = async (req, res, next) => {
    try {
        const result = await commentService.deleteComment(req.params.postId, req.params.commentId, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.replyComment = async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const result = await commentService.replyComment(req.params.postId, req.params.commentId, req.user.id, req.body, io);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};