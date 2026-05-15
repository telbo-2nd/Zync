require('dotenv').config();
const { sequelize } = require('../config/dbConfig');
require('../models/index');

const { User, Post, Comment, Like, Follow } = require('../models/index');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        await sequelize.sync();
        console.log('🔄 Seeding...');

        // ─── 0. CLEAR OLD DATA ───────────────────────────────────
        await Like.destroy({ where: {} });
        await Comment.destroy({ where: {} });
        await Follow.destroy({ where: {} });
        await Post.destroy({ where: {} });
        await User.destroy({ where: {} });
        console.log('🗑️ Old data cleared');

        // ─── 1. USERS ────────────────────────────────────────────
        const hashedPassword = await bcrypt.hash('Password123', parseInt(process.env.HASH_SALT));

        await User.bulkCreate([
            {
                id: '11111111-1111-1111-1111-111111111111',
                firstname: 'Ahmed',
                lastname: 'Ali',
                username: 'ahmed_ali',
                email: 'ahmed@test.com',
                password: hashedPassword,
                phone: '01012345678',
                isVerified: true,
                accountStatus: 'active',
                bio: 'Software Developer'
            },
            {
                id: '22222222-2222-2222-2222-222222222222',
                firstname: 'Mohamed',
                lastname: 'Hassan',
                username: 'mo_hassan',
                email: 'mohamed@test.com',
                password: hashedPassword,
                phone: '01112345678',
                isVerified: true,
                accountStatus: 'active',
                bio: 'UI/UX Designer'
            },
            {
                id: '33333333-3333-3333-3333-333333333333',
                firstname: 'Sara',
                lastname: 'Mahmoud',
                username: 'sara_m',
                email: 'sara@test.com',
                password: hashedPassword,
                phone: '01212345678',
                isVerified: true,
                accountStatus: 'active',
                bio: 'Photographer'
            },
            {
                id: '44444444-4444-4444-4444-444444444444',
                firstname: 'Omar',
                lastname: 'Khaled',
                username: 'omar_k',
                email: 'omar@test.com',
                password: hashedPassword,
                phone: '01512345678',
                isVerified: true,
                accountStatus: 'active',
                bio: 'Gamer'
            },
        ], { individualHooks: false });
        console.log('✅ Users created');

        // ─── 2. FOLLOWS ──────────────────────────────────────────
        await Follow.bulkCreate([
            // ahmed و mohamed بيفولو بعض (friends)
            { followerId: '11111111-1111-1111-1111-111111111111', followedId: '22222222-2222-2222-2222-222222222222' },
            { followerId: '22222222-2222-2222-2222-222222222222', followedId: '11111111-1111-1111-1111-111111111111' },

            // ahmed و sara بيفولو بعض (friends)
            { followerId: '11111111-1111-1111-1111-111111111111', followedId: '33333333-3333-3333-3333-333333333333' },
            { followerId: '33333333-3333-3333-3333-333333333333', followedId: '11111111-1111-1111-1111-111111111111' },

            // omar بيفولو ahmed بس (مش friends)
            { followerId: '44444444-4444-4444-4444-444444444444', followedId: '11111111-1111-1111-1111-111111111111' },
        ]);
        console.log('✅ Follows created');

        // ─── 3. POSTS ────────────────────────────────────────────
        const posts = await Post.bulkCreate([
            // Ahmed posts
            {
                userId: '11111111-1111-1111-1111-111111111111',
                content: 'أول بوست من Ahmed - Public',
                type: 'text',
                privacy: 'Public',
                mediaUrls: [],
                likesCount: 0,
                commentsCount: 0
            },
            {
                userId: '11111111-1111-1111-1111-111111111111',
                content: 'بوست خاص من Ahmed - Friends Only',
                type: 'text',
                privacy: 'Friends-only',
                mediaUrls: [],
                likesCount: 0,
                commentsCount: 0
            },
            {
                userId: '11111111-1111-1111-1111-111111111111',
                content: 'بوست Private من Ahmed',
                type: 'text',
                privacy: 'Private',
                mediaUrls: [],
                likesCount: 0,
                commentsCount: 0
            },
            // Mohamed posts
            {
                userId: '22222222-2222-2222-2222-222222222222',
                content: 'بوست من Mohamed - Public',
                type: 'text',
                privacy: 'Public',
                mediaUrls: [],
                likesCount: 0,
                commentsCount: 0
            },
            {
                userId: '22222222-2222-2222-2222-222222222222',
                content: 'بوست Friends Only من Mohamed',
                type: 'text',
                privacy: 'Friends-only',
                mediaUrls: [],
                likesCount: 0,
                commentsCount: 0
            },
            // Sara posts
            {
                userId: '33333333-3333-3333-3333-333333333333',
                content: 'بوست من Sara - Public',
                type: 'text',
                privacy: 'Public',
                mediaUrls: [],
                likesCount: 0,
                commentsCount: 0
            },
            // Omar posts
            {
                userId: '44444444-4444-4444-4444-444444444444',
                content: 'بوست من Omar - Public',
                type: 'text',
                privacy: 'Public',
                mediaUrls: [],
                likesCount: 0,
                commentsCount: 0
            },
        ]);
        console.log('✅ Posts created');

        // ✅ جيب الـ ids الحقيقية من الـ DB
        const [ahmedPublic, ahmedFriends, ahmedPrivate, mohamedPublic] = posts;

        // ─── 4. COMMENTS ─────────────────────────────────────────
        const comments = await Comment.bulkCreate([
            {
                userId: '22222222-2222-2222-2222-222222222222',
                postId: ahmedPublic.id,
                content: 'كومنت من Mohamed على بوست Ahmed',
                parentId: null
            },
            {
                userId: '33333333-3333-3333-3333-333333333333',
                postId: ahmedPublic.id,
                content: 'كومنت من Sara على بوست Ahmed',
                parentId: null
            },
            {
                userId: '11111111-1111-1111-1111-111111111111',
                postId: mohamedPublic.id,
                content: 'كومنت من Ahmed على بوست Mohamed',
                parentId: null
            },
        ]);
        console.log('✅ Comments created');

        // reply على أول كومنت
        await Comment.create({
            userId: '11111111-1111-1111-1111-111111111111',
            postId: ahmedPublic.id,
            content: 'رد من Ahmed على كومنت Mohamed',
            parentId: comments[0].id
        });
        console.log('✅ Replies created');

        // تحديث commentsCount
        await Post.update({ commentsCount: 3 }, { where: { id: ahmedPublic.id } });
        await Post.update({ commentsCount: 1 }, { where: { id: mohamedPublic.id } });

        // ─── 5. LIKES ────────────────────────────────────────────
        await Like.bulkCreate([
            { userId: '22222222-2222-2222-2222-222222222222', postId: ahmedPublic.id },
            { userId: '33333333-3333-3333-3333-333333333333', postId: ahmedPublic.id },
            { userId: '44444444-4444-4444-4444-444444444444', postId: ahmedPublic.id },
            { userId: '11111111-1111-1111-1111-111111111111', postId: mohamedPublic.id },
            { userId: '33333333-3333-3333-3333-333333333333', postId: mohamedPublic.id },
        ]);

        // تحديث likesCount
        await Post.update({ likesCount: 3 }, { where: { id: ahmedPublic.id } });
        await Post.update({ likesCount: 2 }, { where: { id: mohamedPublic.id } });
        console.log('✅ Likes created');

        console.log('🎉 Seeding completed successfully!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seed();