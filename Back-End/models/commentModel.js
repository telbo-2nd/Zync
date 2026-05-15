const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Comment = sequelize.define(
    'Comment',
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

        content: {
        type: DataTypes.TEXT,
        allowNull: false,
        },

        parentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'comments',
            key: 'id',
        },
        allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: 'comments',
    }
);

module.exports = Comment;