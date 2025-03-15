import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export async function loadModels(scene, faceColor) {
    let house, avatar;

    try {
        // Load Japan House
        house = await new Promise((resolve, reject) => {
            loader.load(
                '../japanHouse.glb',
                (gltf) => resolve(gltf.scene),
                undefined,
                (error) => reject(`Failed to load Japan House: ${error.message}`)
            );
        });
        house.position.set(0, 0, 0);
        house.scale.set(1, 1, 1);
        scene.add(house);

        // Load Avatar
        avatar = await new Promise((resolve, reject) => {
            loader.load(
                '../avater.glb',
                (gltf) => resolve(gltf.scene),
                undefined,
                (error) => reject(`Failed to load Avatar: ${error.message}`)
            );
        });

        // Apply colors to avatar parts
        const facePart = avatar.getObjectByName('face');
        if (facePart && facePart.material) {
            facePart.material.color.set(faceColor);
        } else {
            console.warn('Face part not found or material is missing.');
        }

        avatar.position.set(-2.4, 0.7, -2.5);
        avatar.rotation.set(0, 0, 0);
        avatar.scale.set(0.6, 0.6, 0.6);

        house.add(avatar);

        // Get the avatar name from local storage
        const avatarName = localStorage.getItem('avatarName') || 'Avatar';

        // Create a canvas for the text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;

        // Set font properties
        context.font = 'Bold 80px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';

        // Draw text on canvas
        context.fillText(avatarName, 128, 64);

        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);

        // Create sprite material
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });

        // Create sprite
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1, 0.5, 1);

        // Position sprite above avatar's head
        sprite.position.set(0, 1.5, 0);

        // Add sprite to avatar
        avatar.add(sprite);

        console.log('Models loaded successfully!');
    } catch (error) {
        console.error('Error loading models:', error);

        // Fallback to a simple box geometry if GLB loading fails
        avatar = createAvatarModel(faceColor, 'Fallback Avatar');
        avatar.position.set(-2.4, 0.7, -2.5);
        avatar.scale.set(0.6, 0.6, 0.6);
        scene.add(avatar);
    }

    return { house, avatar };
}

export function createAvatarModel(faceColor, avatarName = 'Player') {
    return new Promise((resolve, reject) => {
        loader.load(
            '../avater.glb',
            (gltf) => {
                const avatarModel = gltf.scene;

                // Apply custom color to the face part
                const facePart = avatarModel.getObjectByName('face');
                if (facePart && facePart.material) {
                    facePart.material.color.set(faceColor);
                } else {
                    console.warn('Face part not found or material is missing.');
                }

                avatarModel.scale.set(0.6, 0.6, 0.6);

                // Create a canvas for the text
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 128;

                // Set font properties
                context.font = 'Bold 80px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'center';

                // Draw text on canvas
                context.fillText(avatarName, 128, 64);

                // Create texture from canvas
                const texture = new THREE.CanvasTexture(canvas);

                // Create sprite material
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture });

                // Create sprite
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(1, 0.5, 1);

                // Position sprite above avatar's head
                sprite.position.set(0, 1.5, 0);

                // Add sprite to avatar
                avatarModel.add(sprite);

                resolve(avatarModel);
            },
            undefined,
            (error) => {
                console.error('Failed to load avatar GLB model:', error);

                // Fallback to a simple box geometry
                const geometry = new THREE.BoxGeometry(1, 2, 1);
                const material = new THREE.MeshBasicMaterial({ color: faceColor });
                const boxModel = new THREE.Mesh(geometry, material);

                // Create a canvas for the text
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 128;

                // Set font properties
                context.font = 'Bold 80px Arial';
                context.fillStyle = 'white';
                context.textAlign = 'center';

                // Draw text on canvas
                context.fillText(avatarName, 128, 64);

                // Create texture from canvas
                const texture = new THREE.CanvasTexture(canvas);

                // Create sprite material
                const spriteMaterial = new THREE.SpriteMaterial({ map: texture });

                // Create sprite
                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(1, 0.5, 1);

                // Position sprite above box
                sprite.position.set(0, 1.5, 0);

                // Add sprite to box
                boxModel.add(sprite);

                resolve(boxModel);
            }
        );
    });
}