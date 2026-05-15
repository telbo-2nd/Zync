const router = require('express').Router();
const conversationController = require('../controllers/conversationController');
const { authMiddleware } = require('../middleWares/authMiddleWare');

router.post('/:userId', authMiddleware, conversationController.getOrCreateConversation);
router.get('/', authMiddleware, conversationController.getMyConversations);
router.get('/:id/messages', authMiddleware, conversationController.getMessages);
router.post('/:id/messages', authMiddleware, conversationController.sendMessage);
router.delete('/:id/messages/:messageId', authMiddleware, conversationController.deleteMessage);

module.exports = router;