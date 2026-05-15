const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authMiddleware }= require('../middleWares/authMiddleWare');
const upload = require('../utils/multer');

//follow
router.post('/:id/follow', authMiddleware,userController.followUser);
//unfollow
router.delete('/:id/unfollow', authMiddleware, userController.unfollowUser);
//get my followers
router.get('/me/followers', authMiddleware, userController.getMyFollowers);  
//get my following
router.get('/me/following', authMiddleware, userController.getMyFollowing);
//get followers of another user
router.get('/:id/followers', authMiddleware, userController.getFollowers);
//get following of another user
router.get('/:id/following', authMiddleware ,userController.getFollowing);
//get another user profile
router.get('/:id/profile', authMiddleware, userController.getUserProfile);
//update my profile
router.put('/me/profile', authMiddleware, upload.single('profilePicture'), userController.updateMyProfile);
//search users
router.get('/search', authMiddleware, userController.searchUsers);

module.exports = router;
