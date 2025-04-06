// Game State
let currentUser = null;
let gameBoard = [];
let solution = [];
let initialBoard = [];
let selectedCell = null;
let timer = 0;
let timerInterval = null;
let score = 0;
let trophies = 0;

// Add difficulty settings
const DIFFICULTY_SETTINGS = {
    easy: { cellsToRemove: 30, scoreMultiplier: 1 },
    medium: { cellsToRemove: 40, scoreMultiplier: 1.5 },
    hard: { cellsToRemove: 50, scoreMultiplier: 2 }
};

let currentDifficulty = 'medium';

// DOM Elements
const sudokuGrid = document.getElementById('sudoku-grid');
const numberPad = document.querySelector('.number-pad');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const trophiesDisplay = document.getElementById('trophies');
const authModal = document.getElementById('auth-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    setupEventListeners();
    checkAuthStatus();
});

// Add keyboard input support
document.addEventListener('keydown', handleKeyboardInput);

// Game Initialization
function initializeGame() {
    createGrid();
    createNumberPad();
    generateNewPuzzle();
    updateDisplay();
}

function createGrid() {
    sudokuGrid.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => selectCell(i));
        sudokuGrid.appendChild(cell);
    }
}

function createNumberPad() {
    numberPad.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => setNumber(i));
        numberPad.appendChild(button);
    }
}

// Sudoku Logic
function generateNewPuzzle() {
    // Generate a solved Sudoku board
    solution = generateSolvedBoard();
    
    // Create initial puzzle by removing some numbers
    initialBoard = [...solution];
    removeNumbers(initialBoard, DIFFICULTY_SETTINGS[currentDifficulty].cellsToRemove);
    
    // Set current board to initial board
    gameBoard = [...initialBoard];
    
    // Reset game state
    selectedCell = null;
    score = 0;
    updateScore();
    
    // Start timer
    startTimer();
    
    // Update display
    updateDisplay();
}

function generateSolvedBoard() {
    const board = Array(9).fill().map(() => Array(9).fill(0));
    solveSudoku(board);
    return board;
}

function solveSudoku(board) {
    const empty = findEmptyCell(board);
    if (!empty) return true;
    
    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}

function findEmptyCell(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function isValid(board, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === num) return false;
        }
    }
    
    return true;
}

function removeNumbers(board, count) {
    while (count > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            count--;
        }
    }
}

// Game Interaction
function selectCell(index) {
    const row = Math.floor(index / 9);
    const col = index % 9;
    
    // Deselect previous cell
    if (selectedCell !== null) {
        document.querySelector(`[data-index="${selectedCell}"]`).classList.remove('selected');
    }
    
    // Select new cell
    selectedCell = index;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add('selected');
    
    // Scroll cell into view on mobile
    cell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function setNumber(num) {
    if (selectedCell === null) return;
    
    const row = Math.floor(selectedCell / 9);
    const col = selectedCell % 9;
    
    gameBoard[row][col] = num;
    updateDisplay();
}

// Display Updates
function updateDisplay() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const value = gameBoard[row][col];
        
        cell.textContent = value || '';
        cell.className = 'cell';
        
        if (value !== 0) {
            if (initialBoard[row][col] !== 0) {
                cell.classList.add('initial');
            } else if (value === solution[row][col]) {
                cell.classList.add('success');
            } else {
                cell.classList.add('error');
            }
        }
        
        if (index === selectedCell) {
            cell.classList.add('selected');
        }
    });
}

// Timer Functions
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Score System
function updateScore() {
    scoreDisplay.textContent = score;
    trophiesDisplay.textContent = trophies;
}

function addScore(points) {
    const multiplier = DIFFICULTY_SETTINGS[currentDifficulty].scoreMultiplier;
    score += Math.floor(points * multiplier);
    
    // Trophy system improvements
    const trophyThresholds = [
        { score: 1000, trophy: '🥉', message: 'Bronze Trophy Earned!' },
        { score: 2500, trophy: '🥈', message: 'Silver Trophy Earned!' },
        { score: 5000, trophy: '🥇', message: 'Gold Trophy Earned!' },
        { score: 10000, trophy: '🏆', message: 'Master Trophy Earned!' }
    ];
    
    for (const threshold of trophyThresholds) {
        if (score >= threshold.score && trophies < trophyThresholds.indexOf(threshold) + 1) {
            trophies++;
            showTrophyNotification(threshold.trophy, threshold.message);
            break;
        }
    }
    
    updateScore();
    saveUserProgress();
}

function showTrophyNotification(trophy, message) {
    const notification = document.createElement('div');
    notification.className = 'trophy-notification';
    notification.innerHTML = `
        <span class="trophy-icon">${trophy}</span>
        <span class="trophy-message">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Authentication
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateAuthUI(true);
        loadUserProgress();
    } else {
        updateAuthUI(false);
    }
}

function updateAuthUI(isLoggedIn) {
    const authContainer = document.getElementById('auth-container');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    if (isLoggedIn) {
        authContainer.classList.add('hidden');
        userInfo.classList.remove('hidden');
        usernameDisplay.textContent = currentUser.username;
    } else {
        authContainer.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
}

// Local Storage
function saveUserProgress() {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    users[currentUser.username] = {
        ...users[currentUser.username],
        score,
        trophies,
        lastPlayed: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUserProgress() {
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const userData = users[currentUser.username];
    
    if (userData) {
        score = userData.score || 0;
        trophies = userData.trophies || 0;
        updateScore();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Auth buttons
    document.getElementById('login-btn').addEventListener('click', () => showAuthModal('login'));
    document.getElementById('register-btn').addEventListener('click', () => showAuthModal('register'));
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', () => {
        authModal.classList.remove('show');
    });
    
    // Auth form submissions
    document.getElementById('login-submit').addEventListener('click', handleLogin);
    document.getElementById('register-submit').addEventListener('click', handleRegister);
    
    // Game controls
    document.getElementById('new-game').addEventListener('click', generateNewPuzzle);
    document.getElementById('check-solution').addEventListener('click', checkSolution);
    
    // Add difficulty selector listeners
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.dataset.difficulty;
            setDifficulty(difficulty);
        });
    });
}

function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === difficulty);
    });
}

// Auth Functions
function showAuthModal(type) {
    authModal.classList.add('show');
    loginForm.classList.toggle('hidden', type === 'register');
    registerForm.classList.toggle('hidden', type === 'login');
}

function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    
    if (user && user.password === password) {
        currentUser = { username, password };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI(true);
        loadUserProgress();
        authModal.classList.remove('show');
    } else {
        alert('Invalid username or password');
    }
}

function handleRegister() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
        alert('Username already exists');
        return;
    }
    
    users[username] = {
        password,
        score: 0,
        trophies: 0,
        lastPlayed: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { username, password };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateAuthUI(true);
    authModal.classList.remove('show');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI(false);
    score = 0;
    trophies = 0;
    updateScore();
}

// Game Control Functions
function checkSolution() {
    let correct = 0;
    let totalCells = 0;
    let progress = 0;
    
    // Count correct cells and total cells to fill
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (initialBoard[i][j] === 0) {
                totalCells++;
                if (gameBoard[i][j] === solution[i][j]) {
                    correct++;
                }
            }
        }
    }
    
    progress = (correct / totalCells) * 100;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    // Create solution preview modal
    const preview = document.createElement('div');
    preview.className = 'solution-preview';
    
    let message = '';
    if (correct === totalCells) {
        const timeBonus = Math.max(0, 300 - timer);
        const baseScore = 100 * DIFFICULTY_SETTINGS[currentDifficulty].scoreMultiplier;
        const totalScore = baseScore + timeBonus;
        
        message = `🎉 Congratulations! You solved the puzzle!\n` +
                 `⏱️ Time Bonus: ${timeBonus} points\n` +
                 `🎯 Total Score: ${totalScore} points`;
        
        addScore(totalScore);
    } else {
        message = `Keep going! You have ${correct} out of ${totalCells} correct numbers.\n` +
                 `Progress: ${Math.round(progress)}%`;
    }
    
    preview.innerHTML = `
        <h3>Solution Check</h3>
        <div class="message">${message}</div>
        <div class="solution-grid"></div>
        <div class="buttons">
            <button class="close-solution">Close</button>
            ${correct !== totalCells ? '<button class="apply-solution">Apply Solution</button>' : ''}
        </div>
    `;
    
    // Generate solution grid
    const solutionGrid = preview.querySelector('.solution-grid');
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'solution-cell';
            cell.textContent = solution[i][j];
            if (initialBoard[i][j] !== 0) {
                cell.classList.add('initial');
            }
            solutionGrid.appendChild(cell);
        }
    }
    
    // Add button functionality
    preview.querySelector('.close-solution').addEventListener('click', () => {
        preview.classList.remove('show');
        setTimeout(() => preview.remove(), 300);
    });
    
    if (correct !== totalCells) {
        preview.querySelector('.apply-solution').addEventListener('click', () => {
            gameBoard = [...solution];
            updateDisplay();
            preview.classList.remove('show');
            setTimeout(() => preview.remove(), 300);
            generateNewPuzzle();
        });
    }
    
    document.body.appendChild(preview);
    setTimeout(() => preview.classList.add('show'), 100);
}

function handleKeyboardInput(event) {
    if (selectedCell === null) return;
    
    const key = event.key;
    if (key >= '1' && key <= '9') {
        setNumber(parseInt(key));
    } else if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
        moveSelection(key);
    } else if (key === 'Backspace' || key === 'Delete') {
        clearCell();
    }
}

function moveSelection(direction) {
    if (selectedCell === null) {
        // Find first empty cell if none selected
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(i / 9);
            const col = i % 9;
            if (initialBoard[row][col] === 0) {
                selectCell(i);
                return;
            }
        }
        return;
    }

    let newIndex = selectedCell;
    switch (direction) {
        case 'ArrowUp':
            newIndex = Math.max(0, selectedCell - 9);
            break;
        case 'ArrowDown':
            newIndex = Math.min(80, selectedCell + 9);
            break;
        case 'ArrowLeft':
            newIndex = Math.max(0, selectedCell - 1);
            break;
        case 'ArrowRight':
            newIndex = Math.min(80, selectedCell + 1);
            break;
    }

    // Find next empty cell in the direction
    while (newIndex !== selectedCell) {
        const row = Math.floor(newIndex / 9);
        const col = newIndex % 9;
        if (initialBoard[row][col] === 0) {
            selectCell(newIndex);
            return;
        }
        newIndex += direction.includes('Right') || direction.includes('Down') ? 1 : -1;
    }
}

function clearCell() {
    if (selectedCell === null) return;
    
    const row = Math.floor(selectedCell / 9);
    const col = selectedCell % 9;
    
    if (initialBoard[row][col] === 0) {
        gameBoard[row][col] = 0;
        updateDisplay();
    }
} 