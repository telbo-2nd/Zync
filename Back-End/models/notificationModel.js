const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Notification = sequelize.define(
    'Notification',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        userId: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id',
        },

        allowNull: false, 
        },

        senderId: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
        },

        type: {
        type: DataTypes.ENUM('like', 'comment', 'follow', 'message'),
        allowNull: false,
        },

        postId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'posts',
            key: 'id',
        },
        allowNull: true,
        },

        messageId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'messages',
            key: 'id',
        },
        allowNull: true,
        },

        isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        },
    },
    {
        timestamps: true,
        tableName: 'notifications',
        indexes: [
        {
            fields: ['userId'],
        },
        {
            fields: ['isRead'],
        },
        ],
    }
);

module.exports = Notification;