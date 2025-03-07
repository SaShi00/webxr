// import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

let controller1, controller2;
const controllerFactory = new XRControllerModelFactory();

export function setupVRControllers(renderer, scene) {
    controls.enabled = false;
    controller1 = renderer.xr.getController(0);
    controller2 = renderer.xr.getController(1);
    
    const controllerModel1 = controllerFactory.createControllerModel(controller1);
    const controllerModel2 = controllerFactory.createControllerModel(controller2);

    controller1.add(controllerModel1);
    controller2.add(controllerModel2);
    scene.add(controller1);
    scene.add(controller2);

    // Add event listeners for controller buttons
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
}

export function updateVRMovement(avatar, camera) {
    if (!controller1) return;

    // Get thumbstick data
    const gamepad = controller1.gamepad;
    if (gamepad && gamepad.axes.length >= 2) {
        const [x, z] = gamepad.axes;
        
        // Move avatar based on thumbstick input
        const speed = 0.05;
        avatar.position.x += x * speed;
        avatar.position.z += z * speed;

        // Update camera position relative to avatar
        camera.position.set(
            avatar.position.x,
            avatar.position.y + 1.6,
            avatar.position.z + 3
        );
    }
}

function onSelectStart(event) {
    // Handle button press
    console.log('Button pressed');
}

function onSelectEnd(event) {
    // Handle button release
    console.log('Button released');
}
