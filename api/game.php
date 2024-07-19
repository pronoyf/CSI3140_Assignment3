<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'reset') {
        resetGame();
    } elseif (isset($_POST['action']) && $_POST['action'] === 'guess') {
        guessLetter($_POST['letter']);
    }
    checkGameOver();
} elseif (!isset($_SESSION['game'])) {
    resetGame();
}

echo json_encode($_SESSION['game']);

function resetGame()
{
    $words = ["afghanistan", "albania", "algeria", "andorra", "angola", "argentina", "armenia", "australia", "austria", "azerbaijan", "bahamas", "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize", "benin", "bhutan", "bolivia", "bosniaandherzegovina", "botswana", "brazil", "brunei", "bulgaria", "burkinafaso", "burundi", "cambodia", "cameroon", "canada", "centralafricanrepublic", "chad", "chile", "china", "colombia", "comoros", "costarica", "croatia", "cuba", "cyprus", "czechrepublic", "denmark", "djibouti", "dominica", "dominicanrepublic", "ecuador", "egypt", "elsalvador", "eritrea", "estonia", "ethiopia", "fiji", "finland", "france", "gabon", "gambia", "georgia", "germany", "ghana", "greece", "grenada", "guatemala", "guinea", "guineabissau", "guyana", "haiti", "honduras", "hungary", "iceland", "india", "indonesia", "iran", "iraq", "ireland", "israel", "italy", "jamaica", "japan", "jordan", "kazakhstan", "kenya", "kiribati", "kuwait", "kyrgyzstan", "laos", "latvia", "lebanon", "lesotho", "liberia", "libya", "liechtenstein", "lithuania", "luxembourg", "madagascar", "malawi", "malaysia", "maldives", "mali", "malta", "marshallislands", "mauritania", "mauritius", "mexico", "micronesia", "moldova", "monaco", "mongolia", "montenegro", "morocco", "mozambique", "myanmar", "namibia", "nauru", "nepal", "netherlands", "newzealand", "nicaragua", "niger", "nigeria", "northmacedonia", "norway", "oman", "pakistan", "palau", "palestine", "panama", "papuanewguinea", "paraguay", "peru", "philippines", "poland", "portugal", "qatar", "romania", "russia", "rwanda", "samoa", "sanmarino", "saudiarabia", "senegal", "serbia", "seychelles", "sierraleone", "singapore", "slovakia", "slovenia", "solomonislands", "somalia", "southafrica", "spain", "srilanka", "sudan", "suriname", "sweden", "switzerland", "syria", "taiwan", "tajikistan", "tanzania", "thailand", "togo", "tonga", "tunisia", "turkey", "turkmenistan", "tuvalu", "uganda", "ukraine", "unitedarabemirates", "unitedkingdom", "unitedstates", "uruguay", "uzbekistan", "vanuatu", "vaticancity", "venezuela", "vietnam", "yemen", "zambia", "zimbabwe"];
    $currentWord = $words[array_rand($words)];
    $_SESSION['game'] = [
        'currentWord' => $currentWord,
        'correctGuesses' => [],
        'incorrectGuesses' => [],
        'gameOver' => false,
        'message' => '',
        'score' => 100,
        'guesses' => 0
    ];
}

function guessLetter($letter)
{
    $game = &$_SESSION['game'];
    if (in_array($letter, $game['correctGuesses']) || in_array($letter, $game['incorrectGuesses'])) {
        return;
    }

    if (strpos($game['currentWord'], $letter) !== false) {
        $game['correctGuesses'][] = $letter;
    } else {
        $game['incorrectGuesses'][] = $letter;
        $game['score'] -= 10;
    }

    $game['guesses']++;

    if (count($game['incorrectGuesses']) >= 10) {
        $game['gameOver'] = true;
        $game['message'] = 'Unfortunately, you lost. The word was ' . $game['currentWord'] . '.';
    }

    if (!preg_match('/[^' . implode('', $game['correctGuesses']) . ']/', $game['currentWord'])) {
        $game['gameOver'] = true;
        $game['message'] = 'Congratulations! You won!';
    }
}

function checkGameOver()
{
    $game = &$_SESSION['game'];
    if ($game['gameOver']) {
        // Manage leaderboard
        if (!isset($_SESSION['leaderboard'])) {
            $_SESSION['leaderboard'] = [];
        }
        $score = $game['score'];
        $_SESSION['leaderboard'][] = $score;
        usort($_SESSION['leaderboard'], function ($a, $b) {
            return $b - $a;
        });
        $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);
    }
}
?>