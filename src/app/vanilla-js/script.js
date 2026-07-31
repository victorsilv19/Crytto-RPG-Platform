// State Management
let state = {
    userType: 'master', // master or player
    crytts: 1250,
    characters: [
        {
            id: 1,
            name: "Aragorn Tempestade",
            class: "Guerreiro",
            race: "Humano",
            level: 8,
            hp: { current: 72, max: 85 },
            ac: 18
        },
        {
            id: 2,
            name: "Luna Luaverde", 
            class: "Druida",
            race: "Élfica",
            level: 7,
            hp: { current: 45, max: 52 },
            ac: 14
        }
    ],
    sessions: [
        {
            id: 1,
            title: "Campanha: Reino de Eldoria - Episódio 12",
            date: "2024-12-28",
            time: "19:00",
            duration: 240
        },
        {
            id: 2,
            title: "One-Shot: Mistério na Taverna",
            date: "2024-12-30", 
            time: "20:30",
            duration: 180
        }
    ]
};

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('crytto-state');
    if (saved) {
        state = { ...state, ...JSON.parse(saved) };
    }
    updateUI();
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('crytto-state', JSON.stringify(state));
}

// Update UI elements
function updateUI() {
    document.getElementById('crytts-count').textContent = state.crytts;
    document.getElementById('user-type-badge').textContent = 
        state.userType === 'master' ? '👑 Mestre' : '👤 Jogador';
    
    renderCharacters();
    renderSessions();
}

// Navigation
function showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Show selected screen
    document.getElementById(screenName + '-screen').classList.remove('hidden');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-crytto-red', 'border-b-2', 'border-crytto-red');
    });
    
    event.target.classList.add('text-crytto-red', 'border-b-2', 'border-crytto-red');
}

// User Type Toggle
function toggleUserType() {
    state.userType = state.userType === 'master' ? 'player' : 'master';
    saveState();
    updateUI();
    showNotification(`Mudou para: ${state.userType === 'master' ? 'Mestre' : 'Jogador'}`);
}

// Dice Rolling
function rollDice() {
    document.getElementById('dice-modal').classList.remove('hidden');
    rollSpecificDice(20);
}

function rollSpecificDice(sides) {
    const result = Math.floor(Math.random() * sides) + 1;
    document.getElementById('dice-result').textContent = result;
    document.getElementById('dice-type').textContent = `D${sides}`;
    
    // Add rolling animation
    const diceEl = document.getElementById('dice-result');
    diceEl.style.transform = 'scale(1.2)';
    diceEl.style.color = '#b91c1c';
    
    setTimeout(() => {
        diceEl.style.transform = 'scale(1)';
        diceEl.style.color = '#b91c1c';
    }, 200);
}

// Characters Management
function renderCharacters() {
    const grid = document.getElementById('characters-grid');
    if (!grid) return;
    
    grid.innerHTML = state.characters.map(char => `
        <div class="card p-4 rounded-lg">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 bg-crytto-red/20 rounded-full flex items-center justify-center">
                    <span class="text-lg">${char.name.charAt(0)}</span>
                </div>
                <div>
                    <h3 class="font-semibold">${char.name}</h3>
                    <p class="text-sm text-gray-400">${char.race} ${char.class}</p>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-sm mb-3">
                <div class="text-center bg-gray-800/50 p-2 rounded">
                    <div class="text-xs text-gray-400">Nível</div>
                    <div class="font-bold">${char.level}</div>
                </div>
                <div class="text-center bg-gray-800/50 p-2 rounded">
                    <div class="text-xs text-gray-400">HP</div>
                    <div class="font-bold">${char.hp.current}/${char.hp.max}</div>
                </div>
                <div class="text-center bg-gray-800/50 p-2 rounded">
                    <div class="text-xs text-gray-400">CA</div>
                    <div class="font-bold">${char.ac}</div>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editCharacter(${char.id})" class="flex-1 bg-gray-600 text-white py-1 rounded text-sm hover:bg-gray-500">
                    Editar
                </button>
                <button onclick="deleteCharacter(${char.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

function createCharacter() {
    const name = prompt('Nome do personagem:');
    if (!name) return;
    
    const charClass = prompt('Classe (ex: Guerreiro, Mago):') || 'Guerreiro';
    const race = prompt('Raça (ex: Humano, Élfico):') || 'Humano';
    const level = parseInt(prompt('Nível:')) || 1;
    
    const newChar = {
        id: Date.now(),
        name,
        class: charClass,
        race,
        level,
        hp: { current: 10 + level * 5, max: 10 + level * 5 },
        ac: 10 + level
    };
    
    state.characters.push(newChar);
    saveState();
    updateUI();
    showNotification(`Personagem ${name} criado!`);
}

function editCharacter(id) {
    const char = state.characters.find(c => c.id === id);
    if (!char) return;
    
    const newName = prompt('Nome:', char.name);
    if (newName) char.name = newName;
    
    const newClass = prompt('Classe:', char.class);
    if (newClass) char.class = newClass;
    
    const newLevel = prompt('Nível:', char.level);
    if (newLevel) char.level = parseInt(newLevel);
    
    saveState();
    updateUI();
    showNotification(`${char.name} atualizado!`);
}

function deleteCharacter(id) {
    if (confirm('Tem certeza que deseja excluir este personagem?')) {
        state.characters = state.characters.filter(c => c.id !== id);
        saveState();
        updateUI();
        showNotification('Personagem removido!');
    }
}

// Sessions Management
function renderSessions() {
    const grid = document.getElementById('sessions-grid');
    if (!grid) return;
    
    grid.innerHTML = state.sessions.map(session => `
        <div class="card p-4 rounded-lg">
            <h3 class="font-semibold mb-2">${session.title}</h3>
            <div class="space-y-1 text-sm text-gray-400 mb-3">
                <div class="flex items-center gap-2">
                    <span>📅</span>
                    <span>${new Date(session.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span>⏰</span>
                    <span>${session.time} (${session.duration}min)</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editSession(${session.id})" class="flex-1 bg-gray-600 text-white py-1 rounded text-sm hover:bg-gray-500">
                    Editar
                </button>
                <button onclick="deleteSession(${session.id})" class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

function createSession() {
    const title = prompt('Título da sessão:');
    if (!title) return;
    
    const date = prompt('Data (AAAA-MM-DD):');
    if (!date) return;
    
    const time = prompt('Horário (HH:MM):') || '19:00';
    const duration = parseInt(prompt('Duração em minutos:')) || 180;
    
    const newSession = {
        id: Date.now(),
        title,
        date,
        time,
        duration
    };
    
    state.sessions.push(newSession);
    saveState();
    updateUI();
    showNotification(`Sessão "${title}" agendada!`);
}

function editSession(id) {
    const session = state.sessions.find(s => s.id === id);
    if (!session) return;
    
    const newTitle = prompt('Título:', session.title);
    if (newTitle) session.title = newTitle;
    
    const newDate = prompt('Data (AAAA-MM-DD):', session.date);
    if (newDate) session.date = newDate;
    
    const newTime = prompt('Horário:', session.time);
    if (newTime) session.time = newTime;
    
    saveState();
    updateUI();
    showNotification('Sessão atualizada!');
}

function deleteSession(id) {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
        state.sessions = state.sessions.filter(s => s.id !== id);
        saveState();
        updateUI();
        showNotification('Sessão removida!');
    }
}

// Marketplace
function buyItem(itemName, price) {
    if (state.crytts >= price) {
        state.crytts -= price;
        saveState();
        updateUI();
        showNotification(`🎉 ${itemName} adquirido por ${price} Crytts!`);
    } else {
        showNotification('❌ Crytts insuficientes!', 'error');
    }
}

// Crytts Shop
function buyCrytts(amount, price) {
    if (confirm(`Comprar ${amount} Crytts por R$ ${price.toFixed(2)}?`)) {
        state.crytts += amount;
        saveState();
        updateUI();
        showNotification(`💰 ${amount} Crytts adquiridos!`);
    }
}

// Theme System
function changeTheme() {
    const themes = {
        'default': { primary: '#b91c1c', bg: '#0a0a0a' },
        'dragon': { primary: '#dc2626', bg: '#0f0f0f' },
        'mystic': { primary: '#7c3aed', bg: '#0c0a15' },
        'forest': { primary: '#16a34a', bg: '#0a0f0a' },
        'ocean': { primary: '#0ea5e9', bg: '#020617' }
    };
    
    const themeNames = Object.keys(themes);
    const selected = prompt(`Escolha um tema:\n${themeNames.map((t, i) => `${i+1}. ${t}`).join('\n')}`);
    
    if (selected && themes[themeNames[selected-1]]) {
        const theme = themes[themeNames[selected-1]];
        document.documentElement.style.setProperty('--primary', theme.primary);
        document.body.style.background = theme.bg;
        showNotification(`🎨 Tema "${themeNames[selected-1]}" aplicado!`);
    }
}

// Notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
        type === 'error' ? 'bg-red-600' : 'bg-green-600'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Modal Management
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    showScreen('dashboard');
});