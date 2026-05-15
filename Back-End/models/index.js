// models/index.js
const User = require('./userModel');
const Post = require('./postModel');
const Comment = require('./commentModel');
const Like = require('./likeModel');
const Follow = require('./followModel');
const Notification = require('./notificationModel');
const Conversation = require('./conversationModel');
const Message = require('./messageModel');

// ─── User ↔ Post ─────────────────────────────────────────
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

// ─── User ↔ Comment ──────────────────────────────────────
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// ─── Post ↔ Comment ──────────────────────────────────────
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// ─── Comment ↔ Comment (nested replies) ──────────────────
Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

// ─── User ↔ Like ─────────────────────────────────────────
User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId' });

// ─── Post ↔ Like ─────────────────────────────────────────
Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId' });

// ─── User ↔ Follow ───────────────────────────────────────
User.hasMany(Follow, { foreignKey: 'followerId', as: 'following', onDelete: 'CASCADE' });
User.hasMany(Follow, { foreignKey: 'followedId', as: 'followers', onDelete: 'CASCADE' });
Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followedId', as: 'followed' });

//       Conversation ↔ User 
Conversation.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Conversation.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });
User.hasMany(Conversation, { foreignKey: 'user1Id', as: 'conversationsAsUser1', onDelete: 'CASCADE' });
User.hasMany(Conversation, { foreignKey: 'user2Id', as: 'conversationsAsUser2', onDelete: 'CASCADE' });

//      Conversation ↔ Message 
Conversation.hasMany(Message, { foreignKey: 'conversationId', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

//      Message ↔ User (sender) 
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

//  User ↔ Notification (receiver) 
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId' });

//  User ↔ Notification (sender) 
User.hasMany(Notification, { foreignKey: 'senderId', as: 'sentNotifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

module.exports = {
    User, Post, Comment, Like,
    Follow, Notification, Conversation, Message
};