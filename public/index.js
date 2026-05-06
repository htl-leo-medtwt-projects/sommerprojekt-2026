import { setup, draw, keyPressed } from './sketch.js';
import io from './lib/socket.io.esm.min.js';

window.socket = io();
window.socket.on('connect', () => {
    console.log('Connected to server');
    showRoomDialog();
});

// Room management
let currentRoomCode = null;

// Socket event handlers
window.socket.on('join', (data) => {
    console.log('Joined room:', data.roomCode);
    currentRoomCode = data.roomCode;
    window.currentPlayer = data.player;
    hideRoomDialog();
});

window.socket.on('playersUpdate', (players) => {
    console.log('=== PLAYERS UPDATE RECEIVED ===');
    console.log('Received players update:', players);
    console.log('Current socket ID:', window.socket.id);
    console.log('Filtering out current player...');
    window.otherPlayers = players.filter((p) => p.id !== window.socket.id);
    console.log('Other players after filter:', window.otherPlayers);
    console.log('=== END PLAYERS UPDATE ===');
});

window.socket.on('playerJoined', (player) => {
    console.log('Player joined:', player);
    if (!window.otherPlayers) window.otherPlayers = [];
    window.otherPlayers.push(player);
});

window.socket.on('playerMoved', (data) => {
    console.log('Player moved:', data);
    if (!window.otherPlayers) window.otherPlayers = [];

    let player = window.otherPlayers.find((p) => p.id === data.playerId);
    if (player) {
        player.position = data.position;
        player.level = data.level;
        console.log(
            `Updated player ${data.playerId} position to`,
            data.position,
        );
    } else {
        // Player not found, might be a new player that wasn't properly added
        console.log(`Player ${data.playerId} not found in otherPlayers array`);
    }
});

window.socket.on('playerLeft', (data) => {
    console.log('Player left:', data);
    if (window.otherPlayers) {
        window.otherPlayers = window.otherPlayers.filter(
            (p) => p.id !== data.playerId,
        );
    }
});

// Dialog elements
const roomDialog = document.getElementById('roomDialog');
const createRoomBtn = document.getElementById('createRoomBtn');
const roomCodeInput = document.getElementById('roomCodeInput');
const submitJoinBtn = document.getElementById('submitJoinBtn');
const closeDialogBtn = document.getElementById('closeDialogBtn');

// Dialog event handlers
createRoomBtn.addEventListener('click', () => {
    window.socket.emit('createRoom');
});

submitJoinBtn.addEventListener('click', () => {
    const roomCode = roomCodeInput.value.trim();
    if (roomCode.length === 6) {
        window.socket.emit('joinRoom', { roomCode });
    } else {
        alert('Please enter a valid 6-digit room code');
    }
});

closeDialogBtn.addEventListener('click', () => {
    hideRoomDialog();
});

roomCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitJoinBtn.click();
    }
});

// Dialog functions
function showRoomDialog() {
    roomDialog.showModal();
}

function hideRoomDialog() {
    roomDialog.close();
}

// Export room code for p5 display
export { currentRoomCode };

const p5 = window.p5;
if (!p5) {
    throw new Error(
        'p5.js not found. Make sure to include it in your HTML file.',
    );
}

let p;
new p5((p5) => {
    p = p5;

    p.setup = () => setup(p);
    p.draw = () => draw(p);

    p.keyPressed = () => keyPressed(p);
});
