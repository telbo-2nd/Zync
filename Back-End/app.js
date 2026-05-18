const express = require('express');
const cors = require('cors');
const path = require('path');

require('./models/index');

const errorHandler = require('./middleWares/errorHandler');

const app = express();

app.use(cors({
    origin: 'https://zync-ochre.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://zync-ochre.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

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