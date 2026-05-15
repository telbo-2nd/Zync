// Router
const router = require("express").Router();
const upload = require('../utils/multer');

// Controller
const postsController = require("../controllers/postsController");

// Middleware
const {authMiddleware} = require("../middleWares/authMiddleWare");

// Create Post
router.post("/create", authMiddleware,  upload.array('media', 10),postsController.createPost);

// Update Post
router.put("/:id", authMiddleware,  upload.array('media', 10), postsController.updatePost);

// Delete Post
router.delete("/:id", authMiddleware, postsController.deletePost);

// Get Feed
router.get("/feed", authMiddleware, postsController.getFeed);
// Get Post
router.get("/:id", authMiddleware, postsController.getPost);

router.get("/user/:userId", authMiddleware, postsController.getUserPosts);


module.exports = router;