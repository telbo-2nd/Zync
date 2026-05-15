const likeService = require('../services/likeService');

exports.toggleLike = async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const result = await likeService.toggleLike(req.params.id, req.user.id, io);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};