<?php
// Database connection settings
$DB_HOST = '127.0.0.1';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'CoCurr'; // make sure this matches the database created by CoCurr.sql
$DB_PORT = 3306;


mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);// Throw exceptions on errors for easier debugging

try {
    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME, $DB_PORT);
    $conn->set_charset('utf8mb4');
} catch (mysqli_sql_exception $e) {
    // Friendly error message — adjust for production (don't expose details)
    die("❌ Database connection failed: " . $e->getMessage());
}

// Usage: include or require this file and use $conn (mysqli) for queries.
?>
