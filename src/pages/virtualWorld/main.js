import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { setupControls, updateAvatarMovement, updateAvatarRotation } from './tools/nonVrControler.js';
import { loadModels, createAvatarModel } from './tools/glbLoader.js';
import { setupVRControllers, updateVRMovement } from './tools/vrController.js';
import io from 'socket.io-client';
import { scene, camera, renderer, initializeScene } from './tools/sceneSetup.js';
import { createOtherAvatar, updateOtherAvatar, removeOtherAvatar } from './tools/avatarManager.js';
import { initializeSocket } from './tools/socket.js';
import { initializeChatbox } from './tools/chatbox.js'; // Import the chatbox function

initializeScene(); // Create scene, camera, renderer

// Retrieve selected colors from local storage
const faceColor = localStorage.getItem('avatarFaceColor') || '#4287f5'; // Default blue
let modelsLoaded = false; // Flag to track model loading status
let avatar; // Declare globally to use in controls and VR setup
const otherAvatars = {}; // Store other avatars
let avatarCount = 0;

// const socket = io('http://localhost:3000');
const socket = io('https://webxr-mbvh.onrender.com/');


// Initialize the chatbox
initializeChatbox(socket);

(async () => {
    try {
        const models = await loadModels(scene, faceColor);
        const house = models.house;
        avatar = models.avatar;

        if (!house || !avatar) {
            throw new Error('One or more models failed to load.');
        }

        console.log('House and Avatar are ready:', house, avatar);

        // Mark models as loaded
        modelsLoaded = true;

        // Initialize socket connection after models are loaded
        initializeSocket(socket, avatar, modelsLoaded, faceColor, otherAvatars, scene, avatarCount);

        // Setup Orbit Controls after loading models
        const controls = new OrbitControls(camera, renderer.domElement);
        setupControls(window); // Pass the global window object

        // Start animation loop after models are loaded
        animate();
    } catch (error) {
        console.error('Failed to initialize scene:', error);
    }
})();

// Animation Loop
function animate() {
    renderer.setAnimationLoop(() => {
        if (renderer.xr.isPresenting) {
            // VR mode: Update avatar using VR controllers
            updateVRMovement(avatar);
        } else {
            // Non-VR mode: Update avatar using keyboard/mouse
            updateAvatarMovement(avatar);
            updateAvatarRotation(avatar, camera);
        }

        // Send avatar position and rotation to the server
        if (avatar && modelsLoaded) {
            const position = { x: avatar.position.x, y: avatar.position.y, z: avatar.position.z };
            const rotation = { x: avatar.rotation.x, y: avatar.rotation.y, z: avatar.rotation.z };

            // Emit updated position and rotation to the server
            socket.emit('updateAvatar', {
                position,
                rotation,
                color: faceColor,
                name: localStorage.getItem('avatarName') || 'Player', // Include the avatar name
            });
        }

        renderer.render(scene, camera);
    });
}
