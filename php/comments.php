<?php
require('connect.php');
session_start();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json');

// GET comments in specific post
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['postId'])) {
    $postId = $_GET['postId'];

    $query = $db->prepare('SELECT * FROM comments WHERE postId = :postId ORDER BY createdAt ASC');
    $query->bindParam(':postId', $postId, PDO::PARAM_STR);
    $query->execute();

    $comments = $query->fetchAll(PDO::FETCH_ASSOC);

    if ($comments) {
        echo json_encode($comments);
    } else {
        echo json_encode([]);
    }
    exit;
}

// POST a comment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input) {
        $postId = filter_var($input['postId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $userId = filter_var($input['userId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $description = filter_var($input['description'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $createdAt = date('Y-m-d H:i:s');

        // Validate inputs
        if (empty($description)) {
            echo json_encode(['error' => 'Description is required.']);
            exit;
        }

        // Prepare the SQL query
        $query = $db->prepare('INSERT INTO comments (postId, userId, description, createdAt) VALUES (:postId, :userId, :description, :createdAt)');
        $query->bindParam(':postId', $postId);
        $query->bindParam(':userId', $userId);
        $query->bindParam(':description', $description);
        $query->bindParam(':createdAt', $createdAt);

        // Execute the query
        if ($query->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to insert post.']);
        }
    } else {
        echo json_encode(["error" => "Invalid input."]);
    }
}
?>