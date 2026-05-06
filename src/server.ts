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

// Player management
interface Player {
    id: string;
    position: { x: number; y: number };
    level: string;
    color: string;
    roomCode?: string;
}

const players = new Map<string, Player>();

const ghostColors = [
    '#FFFFFF', // White
    '#FF6B6B', // Red
    '#4ECDC4', // Cyan
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
];

function generateRoomCode(): string {
    let code: string;
    do {
        code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (rooms.has(code));
    return code;
}

io.on('connection', (socket) => {
    socket.on('createRoom', () => {
        const roomCode = generateRoomCode();
        rooms.set(roomCode, new Set([socket.id]));

        // Join socket to the Socket.IO room
        socket.join(roomCode);

        // Initialize player
        const colorIndex = players.size % ghostColors.length;
        const player = {
            id: socket.id,
            position: { x: 0, y: 0 },
            level: 'home',
            color: ghostColors[colorIndex],
            roomCode: roomCode,
        };
        players.set(socket.id, player);

        console.log(`Room ${roomCode} created by ${socket.id}`);
        socket.emit('join', { roomCode, player });
    });

    socket.on('joinRoom', ({ roomCode }: { roomCode: string }) => {
        if (rooms.has(roomCode)) {
            const room = rooms.get(roomCode)!;
            room.add(socket.id);

            // Join socket to the Socket.IO room
            socket.join(roomCode);

            // Initialize player
            const colorIndex = players.size % ghostColors.length;
            const player = {
                id: socket.id,
                position: { x: 0, y: 0 },
                level: 'home',
                color: ghostColors[colorIndex],
                roomCode: roomCode,
            };
            players.set(socket.id, player);

            console.log(`Socket ${socket.id} joined room ${roomCode}`);
            socket.emit('join', { roomCode, player: players.get(socket.id) });

            // Get room players list
            const roomPlayers = Array.from(room)
                .map((id) => players.get(id))
                .filter(Boolean);

            console.log(`Initial room players for ${roomCode}:`, roomPlayers);

            // Send current room players to new player
            socket.emit('playersUpdate', roomPlayers);
            console.log('Sent initial playersUpdate to new player');

            // Notify other players about new player and send updated player list
            socket.to(roomCode).emit('playerJoined', players.get(socket.id));
            io.to(roomCode).emit('playersUpdate', roomPlayers);
            console.log('Sent playersUpdate to all players in room');
        } else {
            console.log(`Room ${roomCode} not found`);
            socket.emit('error', { message: 'Room not found' });
        }
    });

    socket.on(
        'playerMove',
        (data: { position: { x: number; y: number }; level: string }) => {
            const player = players.get(socket.id);
            if (player && player.roomCode) {
                player.position = data.position;
                player.level = data.level;

                console.log(
                    `Player ${socket.id} moved to ${data.position.x},${data.position.y} in level ${data.level}`,
                );

                // Get updated player list for the room
                const room = rooms.get(player.roomCode);
                if (room) {
                    const roomPlayers = Array.from(room)
                        .map((id) => players.get(id))
                        .filter(Boolean);

                    console.log(
                        `Room ${player.roomCode} has ${room.size} players`,
                    );
                    console.log('Sending playersUpdate with:', roomPlayers);

                    // Broadcast player movement and updated player list
                    socket.to(player.roomCode).emit('playerMoved', {
                        playerId: socket.id,
                        position: data.position,
                        level: data.level,
                    });

                    // Send updated players list to all players in room
                    io.to(player.roomCode).emit('playersUpdate', roomPlayers);
                    console.log('Sent playersUpdate to room');
                } else {
                    console.log(
                        `Room ${player.roomCode} not found for player movement`,
                    );
                }
            }
        },
    );

    socket.on('disconnect', () => {
        console.log('user disconnected');

        // Find and notify room about player leaving
        for (const [roomCode, room] of rooms.entries()) {
            if (room.has(socket.id)) {
                socket.to(roomCode).emit('playerLeft', { playerId: socket.id });
                room.delete(socket.id);
                if (room.size === 0) {
                    rooms.delete(roomCode);
                    console.log(`Room ${roomCode} deleted (empty)`);
                }
                break;
            }
        }

        // Remove player data
        players.delete(socket.id);
    });
});

server.listen(PORT);

server.on('listening', () => {
    console.log(`Server listening on port ${PORT}`);
});
