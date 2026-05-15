const router = require('express').Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleWares/authMiddleWare');

router.post('/make-comment', authMiddleware, commentController.createComment);
router.delete('/:commentId', authMiddleware, commentController.deleteComment);
router.post('/:commentId/reply', authMiddleware, commentController.replyComment);

module.exports = router;