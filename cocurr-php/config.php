<?php
// Database configuration
$host = 'localhost';
$db_user = 'root';
$db_password = '';
$db_name = 'cocurr';

// Create connection using mysqli
$conn = new mysqli($host, $db_user, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Set charset to UTF-8
$conn->set_charset("utf8");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
