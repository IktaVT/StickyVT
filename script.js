const container = document.getElementById('redemptions-container');
let ws; // WebSocket variable for PubSub connection
const statusDisplay = document.getElementById('connection-status');

// Save settings to localStorage and connect to PubSub
function saveSettings() {
    const oauthToken = document.getElementById('oauth-token').value.trim();
    const clientId = document.getElementById('client-id').value.trim();
    const userId = document.getElementById('user-id').value.trim();
    const redeemName = document.getElementById('channel-redeem-input').value.trim();

    if (!oauthToken || !clientId || !userId) {
        alert('Please enter valid OAuth Token, Client ID, and User ID before saving.');
        console.error('Validation failed: Missing required fields (OAuth Token, Client ID, or User ID).');
        return;
    }

    localStorage.setItem('oauthToken', oauthToken);
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('userId', userId);
    localStorage.setItem('redeemName', redeemName);

    console.log('Settings saved successfully.');
    alert('Settings saved! Attempting to connect to PubSub...');
    connectToPubSub(oauthToken, clientId, userId);
}

// Load settings from localStorage
function loadSettings() {
    const oauthToken = localStorage.getItem('oauthToken') || '';
    const clientId = localStorage.getItem('clientId') || '';
    const userId = localStorage.getItem('userId') || '';
    const redeemName = localStorage.getItem('redeemName') || '';

    document.getElementById('oauth-token').value = oauthToken;
    document.getElementById('client-id').value = clientId;
    document.getElementById('user-id').value = userId;
    document.getElementById('channel-redeem-input').value = redeemName;

    if (oauthToken && clientId && userId) {
        console.log('Found saved settings. Attempting to connect to PubSub...');
        connectToPubSub(oauthToken, clientId, userId);
    } else {
        console.log('Incomplete settings found. Please update and save settings.');
    }
}
// Update connection status
function updateStatus(connected) {
    if (connected) {
        statusDisplay.textContent = 'Connected';
        statusDisplay.classList.add('connected');
        statusDisplay.classList.remove('disconnected');
    } else {
        statusDisplay.textContent = 'Disconnected';
        statusDisplay.classList.add('disconnected');
        statusDisplay.classList.remove('connected');
    }
}

// Connect to Twitch PubSub
function connectToPubSub(oauthToken, clientId, userId) {
    if (ws) {
        ws.close();
    }

    ws = new WebSocket('wss://pubsub-edge.twitch.tv');

    ws.onopen = () => {
        console.log('Connected to Twitch PubSub');
		updateStatus(true); // Update to "Connected"
        const message = {
            type: 'LISTEN',
            nonce: 'unique-nonce',
            data: {
                topics: [
                    `channel-points-channel-v1.${userId}`,
                    `channel-subscribe-events-v1.${userId}`,
                ],
                auth_token: oauthToken,
            },
        };
        ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => handlePubSubMessage(event.data);

    ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
		updateStatus(false); // Update to "Disconnected" on error
        alert('Couldn’t connect to PubSub. Check OAuth Token, Client ID, and User ID.');
    };

    ws.onclose = () => {
		updateStatus(false); // Update to "Disconnected" on close
        console.log('WebSocket closed.');
    };
}



// Handle incoming PubSub messages
function handlePubSubMessage(data) {
    const message = JSON.parse(data);
    if (message.type === 'MESSAGE') {
        const payload = JSON.parse(message.data.message);

        const selectedEvents = getSelectedEvents();
        if (payload.data.subscription) {
            const subTier = payload.data.subscription.tier;
            if (selectedEvents.subscriptions.includes(subTier)) {
                createStickyNote(payload.data.subscription.user_name);
            }
        } else if (payload.data.redemption) {
            const redeemName = localStorage.getItem('redeemName');
            if (selectedEvents.channelRedeem && payload.data.redemption.reward.title === redeemName) {
                createStickyNote(payload.data.redemption.user.display_name);
            }
        }
    }
}

// Get selected events (subscriptions and channel redeem)
function getSelectedEvents() {
    return {
        subscriptions: [
            document.getElementById('tier1-checkbox').checked ? 1000 : null,
            document.getElementById('tier2-checkbox').checked ? 2000 : null,
            document.getElementById('tier3-checkbox').checked ? 3000 : null,
        ].filter(Boolean),
        channelRedeem: document.getElementById('channel-redeem-checkbox').checked,
    };
}

// Create a sticky note
function createStickyNote(username) {
    const note = document.createElement('div');
    note.className = 'sticky-note';
    note.style.left = '100px';
    note.style.top = '100px';
    note.style.width = '500px'; // Default width
    note.style.height = '500px'; // Default height

    const usernameDiv = document.createElement('div');
    usernameDiv.textContent = username;
	    // Apply a specific rotation of 10 degrees to the username
    usernameDiv.style.transform = `rotate(10deg)`;

    usernameDiv.className = 'username';

    const deleteIcon = document.createElement('div');
    deleteIcon.className = 'delete-icon';
    deleteIcon.addEventListener('click', () => container.removeChild(note));

    note.appendChild(usernameDiv);
    note.appendChild(deleteIcon);
    container.appendChild(note);

    adjustFontSize(usernameDiv, note); // Adjust font size initially
    makeStickyNoteDraggableAndResizable(note);
}


// Adjust font size based on note dimensions
function adjustFontSize(usernameDiv, note) {
    const maxFontSize = 40; // Maximum font size
    const minFontSize = 10; // Minimum font size
    const noteWidth = parseInt(note.style.width, 10);
    const noteHeight = parseInt(note.style.height, 10);

    let fontSize = maxFontSize;
    usernameDiv.style.fontSize = `${fontSize}px`;
    usernameDiv.style.whiteSpace = 'normal'; // Allow text wrapping
    usernameDiv.style.wordWrap = 'break-word';

    // Reduce font size until it fits within the note
    while (
        (usernameDiv.scrollWidth > noteWidth || usernameDiv.scrollHeight > noteHeight) &&
        fontSize > minFontSize
    ) {
        fontSize -= 1;
        usernameDiv.style.fontSize = `${fontSize}px`;
    }

    // Add ellipsis or break text manually if it still doesn't fit
    if (usernameDiv.scrollHeight > noteHeight) {
        usernameDiv.style.overflow = 'hidden';
        usernameDiv.style.textOverflow = 'ellipsis';
        usernameDiv.style.display = '-webkit-box';
        usernameDiv.style.webkitLineClamp = Math.floor(noteHeight / fontSize);
        usernameDiv.style.webkitBoxOrient = 'vertical';
    }
}


// Enable dragging and resizing of sticky notes
function makeStickyNoteDraggableAndResizable(note) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const usernameDiv = note.querySelector('.username'); // Reference to username div

    note.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - note.offsetLeft;
        offsetY = e.clientY - note.offsetTop;
        note.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        note.style.left = `${e.clientX - offsetX}px`;
        note.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        note.style.transition = '';
    });

    note.addEventListener('wheel', (e) => {
        const delta = e.deltaY < 0 ? 10 : -10;
        const newWidth = Math.max(100, parseInt(note.style.width) + delta);
        const newHeight = Math.max(100, parseInt(note.style.height) + delta);
        note.style.width = `${newWidth}px`;
        note.style.height = `${newHeight}px`;

        // Adjust font size dynamically as the note resizes
        adjustFontSize(usernameDiv, note);
    });
}


// Simulate events
document.getElementById('simulate-subscription').addEventListener('click', () => {
    console.log('Simulating subscription...');
    createStickyNote('Test Subscription');
});

document.getElementById('simulate-redeem').addEventListener('click', () => {
    const redeemName = document.getElementById('channel-redeem-input').value.trim();
    if (redeemName) {
        console.log('Simulating channel redeem...');
        createStickyNote(`Test Redeem: ${redeemName}`);
    } else {
        alert('Please enter a Channel Redeem Name to simulate.');
    }
});

const menuContainer = document.getElementById('menu-container');
const menuTrigger = document.getElementById('menu-trigger');
let menuHideTimeout; // Timeout for hiding the menu

// Adjust the size of the menuTrigger to match the menuContainer
function adjustMenuTriggerSize() {
    const { width, height } = menuContainer.getBoundingClientRect();
    menuTrigger.style.width = `${width}px`;
    menuTrigger.style.height = `${height}px`;
}

// Call this function on page load to ensure the menuTrigger matches the menu size
adjustMenuTriggerSize();

// Hide the menu after a delay
function hideMenuAfterDelay() {
    clearTimeout(menuHideTimeout); // Clear any existing timeout
    menuHideTimeout = setTimeout(() => {
        menuContainer.classList.remove('visible'); // Hide the menu
    }, 200); // Hide after 5 seconds
}

// Show the menu immediately on hover
menuTrigger.addEventListener('mouseenter', () => {
    menuContainer.classList.add('visible'); // Show the menu
    clearTimeout(menuHideTimeout); // Prevent hiding while hovering
});

// Hide the menu again after leaving the menu trigger
menuTrigger.addEventListener('mouseleave', hideMenuAfterDelay);

// Initially hide the menu after a delay
hideMenuAfterDelay();

// Adjust menuTrigger size dynamically on window resize
window.addEventListener('resize', adjustMenuTriggerSize);



// Load settings on startup
loadSettings();
document.getElementById('save-settings').addEventListener('click', saveSettings);
