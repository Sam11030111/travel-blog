<?php
session_start();
require('connect.php');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, DELETE');
header('Content-Type: application/json');

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user']);
}

// Handle signup, login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the input stream and decode the JSON data
    $input = json_decode(file_get_contents('php://input'), true);

    // Signup logic
    if (isset($input['signup'])) {
        $name = filter_var($input['name'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
        $password = $input['password'] ?? '';
        $isAdmin = $input['isAdmin'] ?? 0;
        $image = filter_var($input['image'] ?? NULL, FILTER_SANITIZE_URL);

        // Validate inputs
        if (empty($name) || empty($email) || empty($password)) {
            echo json_encode(["error" => "Name, email, and password are required."]);
            exit;
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strpos($email, '@') === false) {
            echo json_encode(["error" => "Invalid email format. Email must include '@'."]);
            exit;
        }

        // Validate password length
        if (strlen($password) < 6) {
            echo json_encode(["error" => "Password must be more than 6 characters."]);
            exit;
        }

         // Check if the email already exists
        $emailCheckQuery = $db->prepare('SELECT id FROM users WHERE email = :email');
        $emailCheckQuery->bindParam(':email', $email);
        $emailCheckQuery->execute();
        if ($emailCheckQuery->rowCount() > 0) {
            echo json_encode(["error" => "Email already exists."]);
            exit;
        }

        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Prepare the SQL query
        $query = $db->prepare('INSERT INTO users (name, email, password, isAdmin, image) VALUES (:name, :email, :password, :isAdmin, :image)');
        $query->bindParam(':name', $name);
        $query->bindParam(':email', $email);
        $query->bindParam(':password', $hashedPassword);
        $query->bindParam(':isAdmin', $isAdmin);
        $query->bindParam(':image', $image);

        // Execute the query
        if ($query->execute()) {
            // Retrieve the user id by fetching the newly created user
            $fetchQuery = $db->prepare('SELECT id, name, email, image, isAdmin FROM users WHERE email = :email');
            $fetchQuery->bindParam(':email', $email);
            $fetchQuery->execute();
            $user = $fetchQuery->fetch(PDO::FETCH_ASSOC);
    
            if ($user) {
                // Store the user information in the session
                $_SESSION['user'] = [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'image' => $user['image'],
                    'isAdmin' => $user['isAdmin']
                ];
                echo json_encode(["message" => "User signed up successfully.", "user" => $_SESSION['user']]);
            } else {
                echo json_encode(["error" => "Failed to retrieve user information."]);
            }
        } else {
            echo json_encode(["error" => "Failed to sign up user."]);
        }
    }

    // Login logic
    if (isset($input['login'])) {
        $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
        $password = $input['password'] ?? '';

        // Validate inputs
        if (empty($email) || empty($password)) {
            echo json_encode(["error" => "Email and password are required."]);
            exit;
        }

        // Prepare the SQL query
        $query = $db->prepare('SELECT * FROM users WHERE email = :email');
        $query->bindParam(':email', $email);
        $query->execute();
        $user = $query->fetch(PDO::FETCH_ASSOC);

        // Verify the password
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user'] = [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'image' => $user['image'],
                'isAdmin' => $user['isAdmin']
            ];
            echo json_encode(["message" => "Login successful.", "user" => $_SESSION['user']]);
        } else {
            echo json_encode(["error" => "Invalid email or password."]);
        }
    }
}


// Check login status
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isLoggedIn()) {
        $user = $_SESSION['user'];
        // Ensure isAdmin is an integer
        $user['isAdmin'] = (int)$user['isAdmin'];
        echo json_encode(["isLoggedIn" => true, "user" => $user]);
    } else {
        echo json_encode(["isLoggedIn" => false]);
    }
}

// Handle logout
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isLoggedIn()) {
        session_unset();
        session_destroy();
        echo json_encode(["message" => "User logged out successfully."]);
    } else {
        echo json_encode(["error" => "No user is logged in."]);
    }
}
?>


