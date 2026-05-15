const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Post = sequelize.define(
    'Post',
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

        content: {
        type: DataTypes.TEXT,
        allowNull: false,
        },


        type: {
        type: DataTypes.ENUM('text', 'image', 'video','Mixed'),
        defaultValue: 'text',
        },
        
        mediaUrls: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },

        privacy: {
        type: DataTypes.ENUM('Public', 'Private', 'Friends-only'),
        defaultValue: 'Public',
        },

        likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        },

        commentsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        },
    },
    {
        timestamps: true,
        tableName: 'posts',
        indexes: [{fields: ['userId']}],
    }
);

module.exports = Post;