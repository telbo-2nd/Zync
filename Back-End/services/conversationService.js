const { Conversation, Message, User, Notification } = require('../models');
const { createNotification } = require('./notificationService');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');
// get or create a conversation between two users
exports.getOrCreateConversation = async (userId, otherUserId) => {

    if (userId === otherUserId) {
        throw new AppError('Cannot start conversation with yourself', 400);
    }

    // Check if other user exists
    const otherUser = await User.findByPk(otherUserId);
    if (!otherUser) throw new AppError('User not found', 404);

    // Check if conversation already exists
    const existing = await Conversation.findOne({
        where: {
            [Op.or]: [
                { user1Id: userId, user2Id: otherUserId },
                { user1Id: otherUserId, user2Id: userId }
            ]
        }
    });

    if (existing) {
        return { success: true, data: existing };
    }

    // Create new conversation
    const conversation = await Conversation.create({
        user1Id: userId,
        user2Id: otherUserId
    });

    return {
        success: true,
        data: conversation
    };
};

// get all conversations for a user with last message and other user info

exports.getMyConversations = async (userId) => {
    const conversations = await Conversation.findAll({
        where: {
            [Op.or]: [{ user1Id: userId }, { user2Id: userId }]
        },
        include: [
            {
                model: Message,
                limit: 1,
                order: [['createdAt', 'DESC']],
                attributes: ['text', 'image', 'createdAt', 'isRead', 'senderId']
            },
            {
                model: User,
                as: 'user1',
                foreignKey: 'user1Id',
                attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture']
            },
            {
                model: User,
                as: 'user2',
                foreignKey: 'user2Id',
                attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture']
            }
        ],
        order: [['updatedAt', 'DESC']]
    });

    // Add unread message count
    const conversationsWithUnread = await Promise.all(
        conversations.map(async (conv) => {
            const unreadCount = await Message.count({
                where: {
                    conversationId: conv.id,
                    senderId: { [Op.ne]: userId }, // مش بعتهم أنا
                    isRead: false
                }
            });
            return {
                ...conv.toJSON(),
                unreadCount
            };
        })
    );

    return {
        success: true,
        data: conversationsWithUnread
    };
};


// get messages for a conversation with pagination
exports.getMessages = async (conversationId, userId, query) => {
    const conversation = await Conversation.findOne({
        where: {
            id: conversationId,
            [Op.or]: [{ user1Id: userId }, { user2Id: userId }]
        }
    });

    if (!conversation) throw new AppError('Conversation not found', 404);

    //  mark all messages as read
    await Message.update(
        { isRead: true },
        {
            where: {
                conversationId,
                senderId: { [Op.ne]: userId },
                isRead: false
            }
        }
    );

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;

    const messages = await Message.findAndCountAll({
        where: { conversationId },
        include: [{
            model: User,
            as: 'sender',
            foreignKey: 'senderId',
            attributes: ['id', 'username', 'profilePicture']
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
    });

    return {
        success: true,
        data: messages.rows.reverse(),
        pagination: {
            total: messages.count,
            page,
            limit,
            totalPages: Math.ceil(messages.count / limit)
        }
    };
};

// send a message in a conversation
exports.sendMessage = async (io, conversationId, senderId, body) => {

    const { text, image } = body;

    if (!text && !image) throw new AppError('Message cannot be empty', 400);

    // Check if sender is part of this conversation
    const conversation = await Conversation.findOne({
        where: {
            id: conversationId,
            [Op.or]: [{ user1Id: senderId }, { user2Id: senderId }]
        }
    });

    if (!conversation) throw new AppError('Conversation not found', 404);

    // Create message
    const message = await Message.create({
        conversationId,
        senderId,
        text: text || null,
        image: image || null,
    });

    // Update conversation updatedAt
    await conversation.update({ updatedAt: new Date() });

    // Determine receiver
    const receiverId = conversation.user1Id === senderId
        ? conversation.user2Id
        : conversation.user1Id;

    console.log("Receiver ID:", receiverId);
    console.log("Connected rooms:", [...io.sockets.adapter.rooms.keys()]);
    // send message via socket
    io.to(receiverId).emit('message:new', {
        conversationId,
        message: {
            id: message.id,
            text: message.text,
            image: message.image,
            senderId,
            createdAt: message.createdAt
        }
    });

    // create notification for receiver
    await createNotification(io, {
        userId: receiverId,
        senderId,
        type: 'message',
        messageId: message.id
    });

    return {
        success: true,
        data: message
    };
};

// delete a message (only sender can delete)

exports.deleteMessage = async (messageId, userId) => {

    const message = await Message.findByPk(messageId);
    if (!message) throw new AppError('Message not found', 404);
    if (message.senderId !== userId) throw new AppError('Unauthorized', 403);

    await message.destroy();

    return {
        success: true,
        message: 'Message deleted successfully'
    };
};