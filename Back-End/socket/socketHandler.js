const { verifyToken } = require('../utils/jwt');

const onlineUsers = new Map();

module.exports = (io) => {

    // ─── Authentication Middleware ────────────────────────────
    io.use((socket, next) => {
        const token = socket.handshake.query.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        const user = verifyToken(token);
        if (!user) {
            return next(new Error('Invalid or expired token'));
        }

        socket.user = user;
        next();
    });

    // Connection 
    io.on('connection', (socket) => {
        console.log(` User connected: ${socket.user.id}`);

        // 1. save user as online
        onlineUsers.set(socket.user.id, socket.id);

        // 2. join user-specific room for direct messaging
        socket.join(socket.user.id);

        // 3. broadcast online status
        socket.broadcast.emit('user:online', { userId: socket.user.id });

        //  Disconnect 
        socket.on('disconnect', () => {
            console.log(` User disconnected: ${socket.user.id}`);
            onlineUsers.delete(socket.user.id);
            socket.broadcast.emit('user:offline', { userId: socket.user.id });
        });
    });

    return onlineUsers;
};