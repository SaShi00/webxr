import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://sashi00.github.io'], // Allow requests from this origin
        methods: ['GET', 'POST'],
    },
});

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://sashi00.github.io'], // Allow requests from this origin
    })
);

// Dictionary to store avatar IDs and names
const avatarDictionary = {};

// Counter for total connected clients (avatars)
let totalAvatars = 0;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Increment the avatar count when a new client connects
    totalAvatars++;
    console.log(`Total avatars connected: ${totalAvatars}`);

    // Send existing avatars to the new client
    const existingAvatars = {};
    for (const [id, data] of Object.entries(avatarDictionary)) {
        existingAvatars[id] = {
            position: data.position,
            rotation: data.rotation,
            color: data.color,
            name: data.name,
        };
    }
    socket.emit('existingAvatars', existingAvatars);

    // Handle new avatar position
    socket.on('updateAvatar', (data) => {
        if (!data || !data.position || !data.rotation || !data.color) {
            console.warn('Invalid updateAvatar data received:', data);
            return;
        }

        // Check if the ID exists in the dictionary
        if (!avatarDictionary[socket.id]) {
            // Use the provided name or default to 'Player'
            const name = data.name || 'Player';
            avatarDictionary[socket.id] = {
                position: data.position,
                rotation: data.rotation,
                color: data.color,
                name: name,
            };
            console.log(`New avatar added to dictionary: ${socket.id} (${name})`);
        } else {
            // Update the existing avatar's data
            avatarDictionary[socket.id].position = data.position;
            avatarDictionary[socket.id].rotation = data.rotation;
            avatarDictionary[socket.id].color = data.color;
        }

        // Broadcast to all other clients
        socket.broadcast.emit('updateAvatar', {
            id: socket.id,
            position: data.position,
            rotation: data.rotation,
            color: data.color,
            name: avatarDictionary[socket.id].name,
        });
    });

    // Handle chat messages
    socket.on('chat message', (msg, username) => {
        console.log(`${username}: ${msg}`);
        // Broadcast the chat message to all clients
        io.emit('chat message', msg, username);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);

        // Remove avatar from the dictionary
        if (avatarDictionary[socket.id]) {
            delete avatarDictionary[socket.id];
            console.log(`Avatar removed from dictionary: ${socket.id}`);
        }

        // Decrement the avatar count when a client disconnects
        totalAvatars--;
        console.log(`Total avatars connected: ${totalAvatars}`);

        // Notify other clients to remove the avatar
        socket.broadcast.emit('removeAvatar', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
