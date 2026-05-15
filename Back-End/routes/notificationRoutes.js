const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleWares/authMiddleWare');

router.get('/', authMiddleware, notificationController.getMyNotifications);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);
router.put('/read-all', authMiddleware, notificationController.markAllAsRead);

module.exports = router;