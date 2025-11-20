<?php
include "db.php";
include "classes/User.php";

$user = new User($conn);

if ($user->register("JohnDoe", "john@example.com", "1234")) {
    echo "✅ User registered successfully!";
} else {
    echo "❌ Registration failed!";
}
?>
