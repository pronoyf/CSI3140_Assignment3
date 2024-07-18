// List of words to guess
const wordList = [
    "afghanistan", "albania", "algeria", "andorra", "angola", "antiguaandbarbuda", "argentina", 
    "armenia", "australia", "austria", "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados",
    "belarus", "belgium", "belize", "benin", "bhutan", "bolivia", "bosniaandherzegovina", 
    "botswana", "brazil", "brunei", "bulgaria", "burkinafaso", "burundi", "caboverde", "cambodia", 
    "cameroon", "canada", "centralafricanrepublic", "chad", "chile", "china", "colombia", "comoros", 
    "congodemocraticrepublicofthe", "congorepublicofthe", "costarica", "croatia", "cuba", 
    "cyprus", "czechrepublic", "denmark", "djibouti", "dominica", "dominicanrepublic", "easttimor", 
    "ecuador", "egypt", "elsalvador", "equatorialguinea", "eritrea", "estonia", "eswatini", "ethiopia", 
    "fiji", "finland", "france", "gabon", "gambia", "georgia", "germany", "ghana", "greece", "grenada", 
    "guatemala", "guinea", "guineabissau", "guyana", "haiti", "honduras", "hungary", "iceland", "india", 
    "indonesia", "iran", "iraq", "ireland", "israel", "italy", "ivorycoast", "jamaica", "japan", 
    "jordan", "kazakhstan", "kenya", "kiribati", "koreanorth", "koreasouth", "kosovo", "kuwait", 
    "kyrgyzstan", "laos", "latvia", "lebanon", "lesotho", "liberia", "libya", "liechtenstein", "lithuania", 
    "luxembourg", "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "marshallislands", 
    "mauritania", "mauritius", "mexico", "micronesia", "moldova", "monaco", "mongolia", "montenegro", 
    "morocco", "mozambique", "myanmar", "namibia", "nauru", "nepal", "netherlands", "newzealand", 
    "nicaragua", "niger", "nigeria", "northmacedonia", "norway", "oman", "pakistan", "palau", 
    "palestine", "panama", "papuanewguinea", "paraguay", "peru", "philippines", "poland", "portugal", 
    "qatar", "romania", "russia", "rwanda", "saintkittsandnevis", "saintlucia", "saintvincentandthegrenadines", 
    "samoa", "sanmarino", "saotomeandprincipe", "saudiarabia", "senegal", "serbia", "seychelles", 
    "sierraleone", "singapore", "slovakia", "slovenia", "solomonislands", "somalia", "southafrica", 
    "southsudan", "spain", "srilanka", "sudan", "suriname", "sweden", "switzerland", "syria", "taiwan", 
    "tajikistan", "tanzania", "thailand", "togo", "tonga", "trinidadandtobago", "tunisia", "turkey", 
    "turkmenistan", "tuvalu", "uganda", "ukraine", "unitedarabemirates", "unitedkingdom", "unitedstates", 
    "uruguay", "uzbekistan", "vanuatu", "vaticancity", "venezuela", "vietnam", "yemen", "zambia", "zimbabwe"
];

// DOM elements
const wordElement = document.getElementById('wordDisplay');
const wrongLettersElement = document.getElementById('wrongLetters');
const playAgainButton = document.getElementById('playButton');
const popupElement = document.getElementById('popup-container');
const notificationElement = document.getElementById('notification-container');
const messageElement = document.getElementById('finalMessage');
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let currentWord = '';
let correctGuesses = [];
let incorrectGuesses = [];

// Initialize the game
function initializeGame() {
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    correctGuesses = [];
    incorrectGuesses = [];
    renderWord();
    updateIncorrectGuesses();
    popupElement.style.display = 'none';
    renderHangman();
}

// Render the word with guessed letters
function renderWord() {
    wordElement.innerHTML = currentWord.split('').map(letter =>
        `<span class="letter">${correctGuesses.includes(letter) ? letter : '_ '}</span>`
    ).join('');

    const guessedWord = wordElement.innerText.replace(/\n/g, '');
    if (guessedWord === currentWord) {
        messageElement.innerText = 'Congratulations! You won!';
        popupElement.style.display = 'flex';
    }
}

// Update the display of incorrect guesses
function updateIncorrectGuesses() {
    wrongLettersElement.innerHTML = incorrectGuesses.length > 0 ? '<p>Wrong</p>' : '';
    wrongLettersElement.innerHTML += incorrectGuesses.map(letter => `<span>${letter}</span>`).join('');
    renderHangman();

    if (incorrectGuesses.length === 10) {
        messageElement.innerText = `Unfortunately, you lost. The word was ${currentWord}.`;
        popupElement.style.display = 'flex';
    }
}

// Show notification for duplicate guesses
function showNotification() {
    notificationElement.classList.add('show');
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 2000);
}

// Render the hangman based on incorrect guesses
function renderHangman() {
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

// Handle keydown events for letter guesses
window.addEventListener('keydown', event => {
    if (popupElement.style.display === 'flex') return;

    if (event.key >= 'a' && event.key <= 'z') {
        const guessedLetter = event.key;
        if (currentWord.includes(guessedLetter)) {
            if (!correctGuesses.includes(guessedLetter)) {
                correctGuesses.push(guessedLetter);
                renderWord();
            } else {
                showNotification();
            }
        } else {
            if (!incorrectGuesses.includes(guessedLetter)) {
                incorrectGuesses.push(guessedLetter);
                updateIncorrectGuesses();
            } else {
                showNotification();
            }
        }
    }
});

// Start a new game on play again button click
playAgainButton.addEventListener('click', initializeGame);

// Start the game when the page loads
initializeGame();
