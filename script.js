document.addEventListener('DOMContentLoaded', () => {
    const wordElement = document.getElementById('wordDisplay');
    const wrongLettersElement = document.getElementById('wrongLetters');
    const playAgainButton = document.getElementById('playButton');
    const popupElement = document.getElementById('popup-container');
    const notificationElement = document.getElementById('notification-container');
    const messageElement = document.getElementById('finalMessage');
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const leaderboardElement = document.getElementById('leaderboard');

    async function fetchGameState() {
        const response = await fetch('api/game.php');
        const gameState = await response.json();
        updateUI(gameState);
    }

    async function sendGameAction(action, data = {}) {
        const response = await fetch('api/game.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ action, ...data })
        });
        const gameState = await response.json();
        updateUI(gameState);
    }

    async function fetchLeaderboard() {
        const response = await fetch('api/leaderboard.php');
        const leaderboard = await response.json();
        updateLeaderboard(leaderboard);
    }

    function updateUI(gameState) {
        const { currentWord, correctGuesses, incorrectGuesses, gameOver, message, score } = gameState;
        wordElement.innerHTML = currentWord.split('').map(letter =>
            `<span class="letter">${correctGuesses.includes(letter) ? letter : '_ '}</span>`
        ).join('');

        wrongLettersElement.innerHTML = incorrectGuesses.length > 0 ? '<p>Wrong</p>' : '';
        wrongLettersElement.innerHTML += incorrectGuesses.map(letter => `<span>${letter}</span>`).join('');
        renderHangman(incorrectGuesses);

        if (gameOver) {
            messageElement.innerText = message;
            popupElement.style.display = 'flex';
            fetchLeaderboard(); // Fetch leaderboard when game is over
        } else {
            popupElement.style.display = 'none';
        }

        scoreElement.textContent = score;
    }

    function updateLeaderboard(leaderboard) {
        leaderboardElement.innerHTML = leaderboard.map((entry, index) => `<li>${index + 1}. ${entry}</li>`).join('');
    }

    function renderHangman(incorrectGuesses) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';

        const hangmanParts = [
            () => { ctx.beginPath(); ctx.moveTo(10, 190); ctx.lineTo(190, 190); ctx.stroke(); }, // Base
            () => { ctx.beginPath(); ctx.moveTo(30, 190); ctx.lineTo(30, 20); ctx.stroke(); }, // Left pillar
            () => { ctx.beginPath(); ctx.moveTo(30, 20); ctx.lineTo(120, 20); ctx.stroke(); }, // Top beam
            () => { ctx.beginPath(); ctx.moveTo(120, 20); ctx.lineTo(120, 50); ctx.stroke(); }, // Rope
            () => { ctx.beginPath(); ctx.arc(120, 70, 20, 0, Math.PI * 2, true); ctx.stroke(); }, // Head
            () => { ctx.beginPath(); ctx.moveTo(120, 90); ctx.lineTo(120, 140); ctx.stroke(); }, // Body
            () => { ctx.beginPath(); ctx.moveTo(120, 100); ctx.lineTo(100, 120); ctx.stroke(); }, // Left arm
            () => { ctx.beginPath(); ctx.moveTo(120, 100); ctx.lineTo(140, 120); ctx.stroke(); }, // Right arm
            () => { ctx.beginPath(); ctx.moveTo(120, 140); ctx.lineTo(100, 170); ctx.stroke(); }, // Left leg
            () => { ctx.beginPath(); ctx.moveTo(120, 140); ctx.lineTo(140, 170); ctx.stroke(); }  // Right leg
        ];

        for (let i = 0; i < incorrectGuesses.length; i++) {
            hangmanParts[i]();
        }
    }

    window.addEventListener('keydown', event => {
        if (popupElement.style.display === 'flex') return;

        if (event.key >= 'a' && event.key <= 'z') {
            sendGameAction('guess', { letter: event.key });
        }
    });

    playAgainButton.addEventListener('click', () => sendGameAction('reset'));

    fetchGameState();
    fetchLeaderboard();
});
