const multer = require('multer');
const path = require('path');
const AppError = require('./AppError');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mkv', 'video/webm'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.mimetype);
        const folder = isImage ? 'uploads/images' : 'uploads/videos';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${req.user.id}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type', 400), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_VIDEO_SIZE }
});


module.exports = upload;