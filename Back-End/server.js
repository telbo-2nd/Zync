require('dotenv').config();

const app = require('./app');
const { sequelize, connectToDB } = require('./config/dbConfig');
const { createServer } = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socket/socketHandler');

const PORT = process.env.PORT || 5000;


const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {

        //will be updated to actual frontend URL in production
        origin: 'http://localhost:5173/', 
        credentials: true,
    }
});

//making io globally accessible in the app
app.set('io', io);
socketHandler(io);

async function startServer() {
    try {
        await connectToDB();
        await sequelize.sync();

        httpServer.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (err) {
        console.error("Failed to start server:", err);
    }
}

startServer();

module.exports = { io };