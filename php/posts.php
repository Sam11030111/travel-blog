<?php
require('connect.php');
session_start();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json');

// Get sorting criteria from query parameters
$sortCriteria = isset($_GET['sort']) ? $_GET['sort'] : 'date_desc';
$categoryFilter = isset($_GET['category']) ? $_GET['category'] : '0';

// Define the sorting order based on the criteria
switch ($sortCriteria) {
    case 'date_asc':
        $orderBy = 'createdAt ASC';
        break;
    case 'date_desc':
        $orderBy = 'createdAt DESC';
        break;
    case 'title':
        $orderBy = 'title ASC';
        break;
    default:
        $orderBy = 'createdAt DESC';
}

// GET all posts with sorting and optional category filtering
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['id'])) {
    $queryStr = "SELECT * FROM travelposts";
    if ($categoryFilter !== '0') {
        $queryStr .= " WHERE categoryId = :categoryId";
        $queryStr .= " ORDER BY $orderBy";
        $query = $db->prepare($queryStr);
        $query->bindParam(':categoryId', $categoryFilter, PDO::PARAM_STR);
    }

    if ($categoryFilter === '0') {
        $queryStr .= " ORDER BY $orderBy";
        $query = $db->prepare($queryStr);
    }

    $query->execute();

    $posts = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($posts);
    exit;
}

// GET single post
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $postId = $_GET['id'];

    $query = $db->prepare('SELECT * FROM travelposts WHERE id = :id');
    $query->bindParam(':id', $postId, PDO::PARAM_STR);
    $query->execute();

    $post = $query->fetch(PDO::FETCH_ASSOC);

    if ($post) {
        echo json_encode($post);
    } else {
        echo json_encode(['error' => 'Post not found']);
    }
    exit;
}

// POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input) {
        $userId = filter_var($input['userId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $title = filter_var($input['title'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $description = filter_var($input['description'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $categoryId = filter_var($input['categoryId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $image = filter_var($input['image'], FILTER_SANITIZE_URL);
        $placeId = filter_var($input['placeId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $createdAt = date("Y-m-d H:i:s");

        // Validate inputs
        if (empty($title) || empty($description) || empty($categoryId) || empty($placeId)) {
            echo json_encode(["error" => "Title, Description, Category and Place are required."]);
            exit;
        }

        // Prepare the SQL query
        $query = $db->prepare('INSERT INTO travelposts (userId, title, description, categoryId, image, placeId, createdAt) VALUES (:userId, :title, :description, :categoryId, :image, :placeId, :createdAt)');
        $query->bindParam(':userId', $userId);
        $query->bindParam(':title', $title);
        $query->bindParam(':description', $description);
        $query->bindParam(':categoryId', $categoryId);
        $query->bindParam(':image', $image);
        $query->bindParam(':placeId', $placeId);
        $query->bindParam(':createdAt', $createdAt);

        // Execute the query
        if ($query->execute()) {
            echo json_encode(['success' => true, 'message' => 'Post submitted successfully!']);
        } else {
            echo json_encode(['error' => 'Failed to insert post.']);
        }
    } else {
        echo json_encode(['error' => 'Invalid input.']);
    }
}

// UPDATE specific post
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input) {
        $postId = filter_var($input['id'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $userId = filter_var($input['userId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $title = filter_var($input['title'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $description = filter_var($input['description'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $categoryId = filter_var($input['categoryId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $image = filter_var($input['image'], FILTER_SANITIZE_URL);
        $placeId = filter_var($input['placeId'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        // Validate inputs
        if (empty($postId) || empty($title) || empty($description) || empty($categoryId)) {
            echo json_encode(["error" => "Post ID, Title, Description, and Category are required."]);
            exit;
        }

        // Prepare the SQL query
        $query = $db->prepare('UPDATE travelposts SET userId = :userId, title = :title, description = :description, categoryId = :categoryId, image = :image, placeId = :placeId WHERE id = :id');
        $query->bindParam(':id', $postId);
        $query->bindParam(':userId', $userId);
        $query->bindParam(':title', $title);
        $query->bindParam(':description', $description);
        $query->bindParam(':categoryId', $categoryId);
        $query->bindParam(':image', $image);
        $query->bindParam(':placeId', $placeId);

        // Execute the query
        if ($query->execute()) {
            echo json_encode(['success' => true, 'message' => 'Update post successfully!']);
        } else {
            echo json_encode(['error' => 'Failed to update post.']);
        }
    } else {
        echo json_encode(['error' => 'Invalid input.']);
    }
}

// DELETE specific post
if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['id'])) {
    $postId = $_GET['id'];

    // Prepare the SQL query
    $query = $db->prepare('DELETE FROM travelposts WHERE id = :id');
    $query->bindParam(':id', $postId, PDO::PARAM_STR);

    // Execute the query
    if ($query->execute()) {
        echo json_encode(['success' => true, 'message' => 'Post deleted successfully!']);
    } else {
        echo json_encode(['error' => 'Failed to delete post.']);
    }
}
?>




