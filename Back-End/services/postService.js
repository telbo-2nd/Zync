const { createPostSchema , updatePostSchema } = require('../validators/postValidator');
const AppError = require('../utils/AppError');
const fs = require('fs');
const { Op ,Sequelize } = require('sequelize');
const { Post, User, Like, Comment, Follow } = require('../models');


// Helper function to determine post type based on uploaded files
const resolvePostType = (files) => {
    if (!files || files.length === 0) return 'text';

    //return true if any file is an image or video
    const hasImage = files.some(f => f.mimetype.startsWith('image/'));
    const hasVideo = files.some(f => f.mimetype.startsWith('video/'));

    if (hasImage && hasVideo) return 'mixed';
    if (hasImage) return 'image';
    if (hasVideo) return 'video';

    return 'text';
};
const formatPost = (post, userId) => {
    const postJson = post.toJSON();
    return {
        ...postJson,
        isLiked: postJson.Likes
            ? postJson.Likes.some(like => like.userId === userId)
            : false,
        likesCount: postJson.Likes ? postJson.Likes.length : 0,
        commentsCount: postJson.Comments ? postJson.Comments.length : 0,
        
        Likes: undefined
    };
};

const areFriends = async (userId1, userId2) => {
    const count = await Follow.count({
        where: {
            [Op.or]: [
                { followerId: userId1, followedId: userId2 },
                { followerId: userId2, followedId: userId1 }
            ]
        }
    });
    return count === 2;
};

exports.createPost = async function (postData, userId, files) {
    const { error, value } = createPostSchema.validate(postData);
    if (error) throw new AppError(error.details[0].message, 400);

    const type = resolvePostType(files);
    const mediaUrls = files && files.length > 0
        ? files.map(f => ({
            url: f.path.replace(/\\/g, '/'),
            type: f.mimetype.startsWith('image/') ? 'image' : 'video'
        }))
        : [];

    const post = await Post.create({
        userId,
        content: value.content,
        privacy: value.privacy,
        type,
        mediaUrls,
    });

    
    const postWithUser = await Post.findByPk(post.id, {
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture']
            },
            {
                model: Like,
                attributes: ['userId']
            },
            {
                model: Comment,
                where: { parentId: null },
                required: false,
                include: [{
                    model: User,
                    attributes: ['id', 'username', 'profilePicture']
                }]
            }
        ]
    });

    return {
        success: true,
        message: 'Post created successfully',
        data: postWithUser
    };
};



exports.updatePost = async function (postId, postData, userId, files) {

    // 1. Validate
    const { error, value } = updatePostSchema.validate(postData);
    if (error) throw new AppError(error.details[0].message, 400);

    // 2. Find the post
    const post = await Post.findByPk(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.userId !== userId) throw new AppError('Unauthorized', 403);

    //3. check if there are new files to upload and handle mediaUrls and type accordingly
    if (files && files.length > 0) {

        // delete old media files from storage if they exist
        if (post.mediaUrls && post.mediaUrls.length > 0) {
            post.mediaUrls.forEach(media => {
                if (fs.existsSync(media.url)) {
                    fs.unlinkSync(media.url);
                }
            });
        }

        // build the new mediaUrls array with type for each file
        value.mediaUrls = files.map(f => ({
            url: f.path.replace(/\\/g, '/'),
            type: f.mimetype.startsWith('image/') ? 'image' : 'video'
        }));

        // determine the new post type based on the uploaded files
        const hasImage = files.some(f => f.mimetype.startsWith('image/'));
        const hasVideo = files.some(f => f.mimetype.startsWith('video/'));
        value.type = hasImage && hasVideo ? 'mixed' : hasImage ? 'image' : 'video';
    }

    // 4. Update the post
    await post.update(value);

    return {
        success: true,
        message: 'Post updated successfully',
        data: post
    };
};


exports.deletePost = async function (postId, userId) {
    // 1. Find the post
    const post = await Post.findByPk(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.userId !== userId) throw new AppError('Unauthorized', 403);

    
    // 2. Delete media files from storage if they exist
    if (post.mediaUrls && post.mediaUrls.length > 0) {
        post.mediaUrls.forEach(media => {
            if (fs.existsSync(media.url)) {
                fs.unlinkSync(media.url);
            }
        });
    }
    // 3. Delete the post
    await post.destroy();

    return {
        success: true,
        message: 'Post deleted successfully'
    };

}
// getPost
exports.getPost = async function (postId, userId) {

    // 1. Find the post with owner info + likes + comments
    const post = await Post.findByPk(postId, {
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture']
            },
            {
                model: Like,
                attributes: ['userId'],
            },
            {
                model: Comment,
                where: { parentId: null }, 
                required: false,
                attributes: ['id', 'content', 'createdAt'],
                include: [
                    {
                        
                        model: User,
                        attributes: ['id', 'username', 'profilePicture']
                    },
                    {
                        
                        model: Comment,
                        as: 'replies',
                        attributes: ['id', 'content', 'createdAt'],
                        include: [{
                            model: User,
                            attributes: ['id', 'username', 'profilePicture']
                        }]
                    }
                ]
            }
        ]
    });

    if (!post) throw new AppError('Post not found', 404);

    // 2. Owner can always see their post
    if (post.userId === userId) {
        return {
            success: true,
            data: formatPost(post, userId)
        };
    }

    // 3. Private post → only owner
    if (post.privacy === 'Private') {
        throw new AppError('this post is private', 403);
    }

    // 4. Friends-only → check friendship
    if (post.privacy === 'Friends-only') {
        const friends = await areFriends(userId, post.userId);
        if (!friends) throw new AppError('You are not friends with the post owner', 403);
    }

    // 5. Public → everyone can see
    return {
        success: true,
        data: formatPost(post, userId)
    };
};

// getFeed

exports.getFeed = async function (userId, query) {

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    // 1) get following IDs (people I follow)
    const following = await Follow.findAll({
        where: { followerId: userId },
        attributes: ['followedId']
    });

    const followingIds = following.map(f => f.followedId);

    // 2) main SQL query
    const posts = await Post.findAndCountAll({
        where: {
            [Op.or]: [

                // 1) my posts
                {
                    userId
                },

                // 2) following + public
                {
                    userId: { [Op.in]: followingIds },
                    privacy: 'Public'
                },

                // 3) friends-only (SQL mutual check)
                {
                    privacy: 'Friends-only',
                    userId: {
                        [Op.in]: Sequelize.literal(`
                            (
                                SELECT f1.followedId
                                FROM follows f1
                                INNER JOIN follows f2
                                ON f1.followedId = f2.followerId
                                WHERE f1.followerId = '${userId}'
                                AND f2.followedId = '${userId}'
                            )
                        `)
                    }
                }
            ]
        },
        include: [
            {
                model: User,
                attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture']
            },
            {
                model: Like,
                attributes: ['userId']
            },
            {
                model: Comment,
                where: { parentId: null },
                required: false,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'profilePicture']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
        distinct: true
    });

    return {
        success: true,
        data: posts.rows.map(post => formatPost(post, userId)),
        pagination: {
            total: posts.count,
            page,
            limit,
            totalPages: Math.ceil(posts.count / limit)
        }
    };
};

exports.getUserPosts = async function (userId) {
    const posts = await Post.findAll({
        where: { userId },
        include: [
        { model: User, attributes: ['id', 'username', 'firstname', 'lastname', 'profilePicture'] },
        { model: Like, attributes: ['userId'] },
        { model: Comment, where: { parentId: null }, required: false,
            include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] },
            { model: Comment, as: 'replies', include: [{ model: User, attributes: ['id', 'username', 'profilePicture'] }] }
            ]
        }
        ],
        order: [['createdAt', 'DESC']]
    });

    return { success: true, data: posts };
};