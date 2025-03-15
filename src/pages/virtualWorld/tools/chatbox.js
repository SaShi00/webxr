import io from 'socket.io-client';

export function initializeChatbox(socket) {
    // Chatbox setup
    const chatboxContainer = document.createElement('div');
    chatboxContainer.id = 'chatbox-container';
    chatboxContainer.style.position = 'fixed';
    chatboxContainer.style.top = '20px';
    chatboxContainer.style.left = '20px';
    chatboxContainer.style.width = '300px';
    chatboxContainer.style.height = '250px';
    chatboxContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    chatboxContainer.style.color = 'white';
    chatboxContainer.style.borderRadius = '10px';
    chatboxContainer.style.display = 'flex';
    chatboxContainer.style.flexDirection = 'column';
    chatboxContainer.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5)';
    document.body.appendChild(chatboxContainer);

    const chatbox = document.createElement('div');
    chatbox.id = 'chatbox';
    chatbox.style.flex = '1';
    chatbox.style.overflowY = 'scroll';
    chatbox.style.padding = '10px';
    chatbox.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
    chatbox.style.fontFamily = 'Arial, sans-serif';
    chatbox.style.fontSize = '14px';
    chatboxContainer.appendChild(chatbox);

    const inputBox = document.createElement('input');
    inputBox.id = 'input-box';
    inputBox.type = 'text';
    inputBox.placeholder = 'Type your message here...';
    inputBox.style.width = '100%';
    inputBox.style.padding = '10px';
    inputBox.style.border = 'none';
    inputBox.style.backgroundColor = 'transparent';
    inputBox.style.color = 'white';
    inputBox.style.outline = 'none';
    inputBox.style.fontFamily = 'Arial, sans-serif';
    inputBox.style.fontSize = '14px';
    chatboxContainer.appendChild(inputBox);

    // Prompt for username
    const username = localStorage.getItem('avatarName') || prompt('Enter your username:');
    localStorage.setItem('avatarName', username);

    // Send message on Enter key
    inputBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && inputBox.value.trim()) {
            socket.emit('chat message', inputBox.value.trim(), username);
            inputBox.value = '';
        }
    });

    // Display incoming messages
    socket.on('chat message', (msg, senderUsername) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${senderUsername}: ${msg}`;
        messageElement.style.marginBottom = '5px';
        messageElement.style.wordBreak = 'break-word';
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Auto-scroll
    });
}
