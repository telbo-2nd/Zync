const router = require("express").Router();

// Controller
const likeController = require("../controllers/likeController");

// Middleware
const {authMiddleware} = require("../middleWares/authMiddleWare");

// Toggle Like
router.post("/:id/like", authMiddleware, likeController.toggleLike);

module.exports = router;