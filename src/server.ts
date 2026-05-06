import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(PORT);

server.on('listening', () => {
    console.log(`Server listening on port ${PORT}`);
});
