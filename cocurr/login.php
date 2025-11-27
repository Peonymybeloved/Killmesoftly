<?php
header('Content-Type: application/json; charset=utf-8');
session_start();

// Load DB connection
require_once __DIR__ . '/db.php';

// Read input (supports JSON and form-encoded)
$data = null;
$raw = file_get_contents('php://input');
if ($raw) {
    $decoded = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        $data = $decoded;
    }
}
if ($data === null) {
    // fallback to POST
    $data = $_POST;
}

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email and password are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email format']);
    exit;
}

try {
    $stmt = $conn->prepare('SELECT userID, userpw FROM Useracc WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($row = $res->fetch_assoc()) {
        $stored = $row['userpw'];
        $userID = $row['userID'];
        $valid = false;
        // If stored password looks like a bcrypt hash, use password_verify
        if (password_needs_rehash($stored, PASSWORD_BCRYPT) || strpos($stored, '$2y$') === 0 || strpos($stored, '$2a$') === 0) {
            // attempt verify — if it's not a valid hash this will simply return false
            if (password_verify($password, $stored)) {
                $valid = true;
            }
        }
        // fallback: direct comparison (for plain-text stored pw)
        if (!$valid && hash_equals($stored, $password)) {
            $valid = true;
        }

        if ($valid) {
            // login success
            $_SESSION['userID'] = $userID;
            echo json_encode(['ok' => true, 'userID' => $userID]);
            exit;
        }
    }

    // not found or invalid
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Invalid email or password']);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server error']);
    exit;
}

?>
