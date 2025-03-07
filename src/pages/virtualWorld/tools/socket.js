import io from 'socket.io-client';
import { createOtherAvatar, updateOtherAvatar, removeOtherAvatar } from './avatarManager.js';

export function initializeSocket(socket, avatar, modelsLoaded, faceColor, otherAvatars, scene, avatarCount) {

    socket.on('connect', () => {
        console.log('Connected to port 3000');

        // Send initial avatar data to the server
        if (avatar && modelsLoaded) {
            socket.emit('updateAvatar', {
                position: { x: avatar.position.x, y: avatar.position.y, z: avatar.position.z },
                rotation: { x: avatar.rotation.x, y: avatar.rotation.y, z: avatar.rotation.z },
                color: faceColor,
                name: localStorage.getItem('avatarName') || 'Player' // Include the avatar name
            });
        }
    });

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    socket.on('existingAvatars', (avatars) => {
        console.log('Existing avatars:', avatars);
        for (const [id, data] of Object.entries(avatars)) {
            createOtherAvatar(id, data, modelsLoaded, otherAvatars, scene, avatarCount);
        }
    });

    socket.on('updateAvatar', (data) => {
        if (!otherAvatars[data.id]) {
            createOtherAvatar(data.id, data, modelsLoaded, otherAvatars, scene, avatarCount);
        } else {
            updateOtherAvatar(data.id, data, modelsLoaded, otherAvatars);
        }
    });

    // Listen for avatar removal events
    socket.on('removeAvatar', (id) => {
        console.log(`Remove avatar with ID: ${id}`);
        removeOtherAvatar(id, otherAvatars, scene, avatarCount);
    });

    return socket;
}