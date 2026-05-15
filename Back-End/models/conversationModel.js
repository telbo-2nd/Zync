const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Conversation = sequelize.define(
    'Conversation',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        // optional: for 1-to-1 chat optimization
        user1Id: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
        },

        user2Id: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: 'conversations',
        indexes: [
        {
            unique: true,
            fields: ['user1Id', 'user2Id'], 
        },
        {
            fields: ['user1Id'],
        },
        {
            fields: ['user2Id'],
        },
        ],
    }
);

module.exports = Conversation;