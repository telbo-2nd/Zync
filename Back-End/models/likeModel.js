const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Like = sequelize.define(
    'Like',
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

        postId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'posts',
            key: 'id',
        },
        allowNull: false,
        },
    },
    {
        timestamps: true,
        tableName: 'likes',
        indexes: [
        {
            unique: true,
            fields: ['userId', 'postId'], 
        },
        {
            fields: ['postId'],
        },
        {
            fields: ['userId'],
        },
        ],
    }
);

module.exports = Like;