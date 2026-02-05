(function () {
    // Configuration
    const script = document.currentScript;
    const WORKSPACE_ID = script?.getAttribute('data-workspace');
    const API_BASE_URL = script?.getAttribute('data-api-url') || 'http://localhost:3000';

    if (!WORKSPACE_ID) {
        console.error('AI Support Widget: Missing data-workspace attribute');
        return;
    }

    // Inject Styles
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = `${API_BASE_URL}/embed/widget.css`;
    document.head.appendChild(styleLink);

    // Create Widget Container
    const container = document.createElement('div');
    container.id = 'ai-support-widget-container';
    document.body.appendChild(container);

    // Widget HTML Structure
    container.innerHTML = `
    <button id="ai-support-button" aria-label="Open Chat">💬</button>
    <div id="ai-support-chat">
      <div id="chat-header">
        <div><span class="status-dot"></span>AI Support</div>
        <button id="close-widget" style="background:none;border:none;cursor:pointer;font-size:20px;">×</button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input-container">
        <input id="chat-input" type="text" placeholder="Type a message..." autocomplete="off" />
        <button id="send-button">Send</button>
      </div>
    </div>
  `;

    // UI Elements
    const button = container.querySelector('#ai-support-button');
    const chatWindow = container.querySelector('#ai-support-chat');
    const closeBtn = container.querySelector('#close-widget');
    const messagesContainer = container.querySelector('#chat-messages');
    const input = container.querySelector('#chat-input');
    const sendButton = container.querySelector('#send-button');

    // State
    let sessionId = localStorage.getItem('ai_support_session_id') || 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('ai_support_session_id', sessionId);
    let conversationHistory = [];

    // Toggle Chat
    button.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Messaging Logic
    async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        appendMessage('user', message);
        input.value = '';
        input.disabled = true;
        sendButton.disabled = true;

        const typingId = showTyping();

        try {
            const response = await fetch(`${API_BASE_URL}/api/widget/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({
                    workspaceId: WORKSPACE_ID,
                    sessionId,
                    message,
                    conversationHistory,
                }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();

            removeTyping(typingId);
            appendMessage('assistant', data.response);

            conversationHistory.push({ role: 'user', content: message });
            conversationHistory.push({ role: 'assistant', content: data.response });

            if (conversationHistory.length > 20) {
                conversationHistory = conversationHistory.slice(-10);
            }
        } catch (error) {
            console.error('AI Support Widget Error:', error);
            removeTyping(typingId);
            appendMessage('assistant', 'Sorry, I am having trouble connecting. Please try again later.');
        } finally {
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    function appendMessage(role, content) {
        const div = document.createElement('div');
        div.className = `message ${role}`;
        div.textContent = content;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTyping() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message assistant typing-indicator';
        div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // Listeners
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Initial Greeting
    setTimeout(() => {
        if (messagesContainer.children.length === 0) {
            appendMessage('assistant', 'Hello! How can I help you today?');
        }
    }, 1000);
})();
