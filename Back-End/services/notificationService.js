const { Notification , User } = require('../models');
const AppError = require('../utils/appError');

//create noti
exports.createNotification = async (io, { userId, senderId, type, postId = null, messageId = null }) => {

    //check if user is trying to notify themselves
    if (userId === senderId) return;

    const notification = await Notification.create({
        userId,
        senderId,
        type,
        postId,
        messageId,
        isRead: false
    });

    //send the noti
    io.to(userId).emit('notification:new', {
        id: notification.id,
        type,
        postId,
        messageId,
        senderId,
        isRead: false,
        createdAt: notification.createdAt
    });

    return notification;
};

//get notis for a user
exports.getMyNotifications = async (userId) => {
    const notifications = await Notification.findAll({
        where: { userId },
        include: [{
            model: User,
            as: 'sender',
            foreignKey: 'senderId',
            attributes: ['id', 'username', 'profilePicture']
        }],
        order: [['createdAt', 'DESC']],
        limit: 20
    });

    return {
        success: true,
        data: notifications
    };
};

//mark a noti as read

exports.markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOne({
        where: { id: notificationId, userId }
    });

    if (!notification) throw new AppError('Notification not found', 404);

    await notification.update({ isRead: true });

    return {
        success: true,
        message: 'Notification marked as read'
    };
};


//mark all notis as read
exports.markAllAsRead = async (userId) => {
    await Notification.update(
        { isRead: true },
        { where: { userId, isRead: false } }
    );

    return {
        success: true,
        message: 'All notifications marked as read'
    };
};