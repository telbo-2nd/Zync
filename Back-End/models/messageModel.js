const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Message = sequelize.define(
    'Message',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        conversationId: {
        type: DataTypes.INTEGER,
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

        text: {
        type: DataTypes.TEXT,
        allowNull: true,
        },

        image: {
        type: DataTypes.STRING,
        allowNull: true,
        },

        isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        },
    },
    {
        timestamps: true,
        tableName: 'messages',
        indexes: [
        {
            fields: ['conversationId'],
        },
        {
            fields: ['senderId'],
        },
        ],
    }
);

module.exports = Message;