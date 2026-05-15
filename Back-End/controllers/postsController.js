const postService = require('../services/postService');

exports.createPost = async (req, res, next) => {
    try {
        const result = await postService.createPost(req.body, req.user.id, req.files);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const result = await postService.updatePost(req.params.id, req.body, req.user.id, req.files);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const result = await postService.deletePost(req.params.id, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getPost = async (req, res, next) => {
    try {
        const result = await postService.getPost(req.params.id, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getFeed = async (req, res, next) => {
    try {
        const result = await postService.getFeed(req.user.id, req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getUserPosts = async (req, res, next) => {
    try {
        const result = await postService.getUserPosts(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};