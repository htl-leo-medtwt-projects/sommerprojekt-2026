import express from 'express';
import http from 'http';
import * as socketio from 'socket.io';

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);

app.use(express.static('public'));

// Room management
const rooms = new Map<string, Set<string>>();

function generateRoomCode(): string {
    let code: string;
    do {
        code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (rooms.has(code));
    return code;
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('createRoom', () => {
        const roomCode = generateRoomCode();
        rooms.set(roomCode, new Set([socket.id]));
        console.log(`Room ${roomCode} created by ${socket.id}`);
        socket.emit('join', { roomCode });
    });

    socket.on('joinRoom', ({ roomCode }: { roomCode: string }) => {
        if (rooms.has(roomCode)) {
            const room = rooms.get(roomCode)!;
            room.add(socket.id);
            console.log(`Socket ${socket.id} joined room ${roomCode}`);
            socket.emit('join', { roomCode });
        } else {
            console.log(`Room ${roomCode} not found`);
            socket.emit('error', { message: 'Room not found' });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        // Remove socket from all rooms
        for (const [roomCode, room] of rooms.entries()) {
            room.delete(socket.id);
            if (room.size === 0) {
                rooms.delete(roomCode);
                console.log(`Room ${roomCode} deleted (empty)`);
            }
        }
    });
});

server.listen(PORT);

server.on('listening', () => {
    console.log(`Server listening on port ${PORT}`);
});
