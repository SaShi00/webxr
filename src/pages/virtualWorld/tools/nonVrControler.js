// Import necessary modules
import * as THREE from 'three';

// Keyboard controls for non-VR mode
const keyboard = {
    forward: false,
    backward: false,
    left: false,
    right: false,
};

const movementSpeed = 0.05; // Adjust speed as needed
const moveDirection = new THREE.Vector3();

/**
 * Sets up keyboard and digital controller event listeners.
 * @param {Window} window - The global window object.
 */
export function setupControls(window) {
    // Keyboard event listeners
    window.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp': keyboard.forward = true; break;
            case 'ArrowDown': keyboard.backward = true; break;
            case 'ArrowLeft': keyboard.left = true; break;
            case 'ArrowRight': keyboard.right = true; break;
        }
    });

    window.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowUp': keyboard.forward = false; break;
            case 'ArrowDown': keyboard.backward = false; break;
            case 'ArrowLeft': keyboard.left = false; break;
            case 'ArrowRight': keyboard.right = false; break;
        }
    });

    // Digital controller event listeners
    document.getElementById('up-arrow').addEventListener('touchstart', () => keyboard.forward = true, { passive: true });
    document.getElementById('up-arrow').addEventListener('touchend', () => keyboard.forward = false, { passive: true });

    document.getElementById('down-arrow').addEventListener('touchstart', () => keyboard.backward = true, { passive: true });
    document.getElementById('down-arrow').addEventListener('touchend', () => keyboard.backward = false, { passive: true });

    document.getElementById('left-arrow').addEventListener('touchstart', () => keyboard.left = true, { passive: true });
    document.getElementById('left-arrow').addEventListener('touchend', () => keyboard.left = false, { passive: true });

    document.getElementById('right-arrow').addEventListener('touchstart', () => keyboard.right = true, { passive: true });
    document.getElementById('right-arrow').addEventListener('touchend', () => keyboard.right = false, { passive: true });

    // Optional: Add mouse click support for desktop testing
    document.getElementById('up-arrow').addEventListener('mousedown', () => keyboard.forward = true);
    document.getElementById('up-arrow').addEventListener('mouseup', () => keyboard.forward = false);

    document.getElementById('down-arrow').addEventListener('mousedown', () => keyboard.backward = true);
    document.getElementById('down-arrow').addEventListener('mouseup', () => keyboard.backward = false);

    document.getElementById('left-arrow').addEventListener('mousedown', () => keyboard.left = true);
    document.getElementById('left-arrow').addEventListener('mouseup', () => keyboard.left = false);

    document.getElementById('right-arrow').addEventListener('mousedown', () => keyboard.right = true);
    document.getElementById('right-arrow').addEventListener('mouseup', () => keyboard.right = false);
}

/**
 * Updates the avatar's position based on keyboard/digital controller input.
 * @param {THREE.Object3D} avatar - The avatar object to update.
 */
export function updateAvatarMovement(avatar) {
    if (!avatar || !avatar.position || !avatar.quaternion) return;

    // Reset move direction
    moveDirection.set(0, 0, 0);

    // Forward/backward movement (along avatar's local Z-axis)
    if (keyboard.forward) moveDirection.z += 1; // Negative Z is forward
    if (keyboard.backward) moveDirection.z -= 1; // Positive Z is backward

    // Left/right movement (along avatar's local X-axis)
    if (keyboard.left) moveDirection.x += 1; // Negative X is left
    if (keyboard.right) moveDirection.x -= 1; // Positive X is right

    // Normalize to prevent faster diagonal movement
    moveDirection.normalize();

    // Convert local movement direction to world space
    const worldDirection = moveDirection.applyQuaternion(avatar.quaternion);

    // Update avatar position
    avatar.position.add(worldDirection.multiplyScalar(movementSpeed));
}

/**
 * Updates the avatar's rotation to face the camera direction.
 * @param {THREE.Object3D} avatar - The avatar object to update.
 * @param {THREE.Camera} camera - The camera object.
 */
export function updateAvatarRotation(avatar, camera) {
    if (!avatar || !camera) return;

    // Get the camera's forward direction in world space
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Convert camera direction to horizontal rotation (ignore Y-axis)
    const targetRotation = Math.atan2(cameraDirection.x, cameraDirection.z);

    // Smoothly interpolate avatar rotation to face the camera direction
    avatar.rotation.y += (targetRotation - avatar.rotation.y) * 0.1; // Adjust interpolation speed as needed
}