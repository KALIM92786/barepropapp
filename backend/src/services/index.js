const { Server } = require('socket.io');

let io;

const init = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected to WebSocket');
    });
};

const broadcast = (event, data) => {
    if (io) io.emit(event, data);
};

module.exports = { init, broadcast };