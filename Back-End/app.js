const express = require('express');
const cors = require('cors');
const path = require('path');

require('./models/index');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({
    origin: 'https://your-vercel-frontend-url.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/likes', require('./routes/likeRoutes'));
app.use('/conversations', require('./routes/conversationRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/posts/:postId/comments', require('./routes/commentRoutes'));
app.use('/posts', require('./routes/postRoutes'));

app.use(errorHandler);

module.exports = app;