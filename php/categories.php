<?php
require('connect.php');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST');
header('Content-Type: application/json');

// GET
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['id'])) {
    $query = $db->prepare('SELECT * FROM categories');
    $query->execute();

    $categories = $query->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($categories);
    exit;
}

// GET specific category
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $categoryId = $_GET['id'];

    $query = $db->prepare('SELECT * FROM categories WHERE id = :id');
    $query->bindParam(':id', $categoryId, PDO::PARAM_STR);
    $query->execute();

    $category = $query->fetch(PDO::FETCH_ASSOC);

    if ($category) {
        echo json_encode($category);
    } else {
        echo json_encode(['error' => 'Category is not found']);
    }
    exit;
}
?>
