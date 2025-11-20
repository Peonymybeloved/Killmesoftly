<?php
include "db.php";
include __DIR__ . "/classes/Task.php";

$task = new Task($conn);

if ($task->addTask("Finish UML Diagram", "Make class diagram for CoCurr", "2025-11-15", "Software Engineering")) {
    echo "✅ Task added successfully!";
} else {
    echo "❌ Error adding task!";
}
?>
