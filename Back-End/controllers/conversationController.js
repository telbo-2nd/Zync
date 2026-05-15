const conversationService = require('../services/conversationService');

exports.getOrCreateConversation = async (req, res, next) => {
    try {
        const result = await conversationService.getOrCreateConversation(req.user.id, req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMyConversations = async (req, res, next) => {
    try {
        const result = await conversationService.getMyConversations(req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const result = await conversationService.getMessages(req.params.id, req.user.id, req.query);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

exports.sendMessage = async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const result = await conversationService.sendMessage(io, req.params.id, req.user.id, req.body);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.deleteMessage = async (req, res, next) => {
    try {
        const result = await conversationService.deleteMessage(req.params.messageId, req.user.id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};