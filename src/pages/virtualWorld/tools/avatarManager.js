import { createAvatarModel } from './glbLoader.js';

export function createOtherAvatar(id, data, modelsLoaded, otherAvatars, scene, avatarCount) {
    if (!modelsLoaded) {
        console.warn('Models not loaded yet. Delaying avatar creation.');
        return;
    }

    // Check if the avatar already exists in the scene
    if (otherAvatars[id]) {
        console.log(`Avatar with ID ${id} already exists. Skipping creation.`);
        return;
    }

    console.log(`Creating avatar with ID: ${id}, Name: ${data.name || 'Unknown'}, Color: ${data.color}`);

    createAvatarModel(data.color, data.name || 'Player')
        .then((otherAvatar) => {
            if (!otherAvatar) {
                console.error('Failed to create other avatar:', id);
                return;
            }

            // Set initial position and rotation
            otherAvatar.position.set(data.position.x, data.position.y, data.position.z);
            otherAvatar.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);

            if (!otherAvatars[id]) {
            // Add to the scene
            scene.add(otherAvatar);

            // Store in the otherAvatars map
            otherAvatars[id] = otherAvatar;

            // Increment the avatar count
            avatarCount++;
            // console.log(`Total avatars in the scene: ${avatarCount}`);
            }
        })
        .catch((error) => {
            console.error('Error creating other avatar:', error);
        });
}

export function updateOtherAvatar(id, data, modelsLoaded, otherAvatars) {
    if (!modelsLoaded) {
        console.warn('Models not loaded yet. Delaying avatar update.');
        return;
    }

    const otherAvatar = otherAvatars[id];
    if (!otherAvatar) {
        console.warn(`Avatar with ID ${id} does not exist. Skipping update.`);
        return;
    }

    // console.log(`Updating avatar with ID: ${id}, Name: ${data.name || 'Unknown'}`);

    // Update the avatar's position and rotation
    otherAvatar.position.set(data.position.x, data.position.y, data.position.z);
    otherAvatar.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
}

export function removeOtherAvatar(id, otherAvatars, scene, avatarCount) {
    const otherAvatar = otherAvatars[id];
    if (!otherAvatar) {
        console.warn(`Avatar with ID ${id} does not exist. Skipping removal.`);
        return;
    }

    // Remove the avatar from the scene
    scene.remove(otherAvatar);

    // Delete from the otherAvatars map
    delete otherAvatars[id];

    // Decrement the avatar count
    avatarCount--;
    console.log(`Avatar removed. Total avatars in the scene: ${avatarCount}`);
}