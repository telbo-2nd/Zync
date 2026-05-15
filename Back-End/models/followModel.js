const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Follow = sequelize.define(
    'Follow',
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },

        followerId: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
        allowNull: false,
        },

        followedId: {
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
        createdAt: 'followDate',
        updatedAt: false,
        tableName: 'follows',
        indexes: [
        {
            unique: true,
            fields: ['followerId', 'followedId'], 
        },
        {
            fields: ['followerId'],
        },
        {
            fields: ['followedId'],
        },
        ],
    }
);

module.exports = Follow;