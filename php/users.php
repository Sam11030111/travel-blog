<?php
require('connect.php');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json');

// GET all users
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['id'])) {
    $query = $db->prepare('SELECT * FROM users');
    $query->execute();

    $users = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
    exit;
}

// GET specific user
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $userId = $_GET['id'];

    $query = $db->prepare('SELECT * FROM users WHERE id = :id');
    $query->bindParam(':id', $userId);
    $query->execute();

    $user = $query->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
    exit;
}
?>
