<?php
session_start();

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $score = $_POST['score'];
    $_SESSION['leaderboard'][] = $score;
    usort($_SESSION['leaderboard'], function ($a, $b) {
        return $b - $a;
    });
    $_SESSION['leaderboard'] = array_slice($_SESSION['leaderboard'], 0, 10);
}

echo json_encode($_SESSION['leaderboard']);
?>