<?php
include "db.php";
include __DIR__ . "/classes/ToDoList.php";

$todo = new ToDoList($conn);

// View all tasks
$tasks = $todo->viewTasks();

if (count($tasks) > 0) {
    echo "✅ Showing all tasks:<br><br>";
    foreach ($tasks as $t) {
        echo "- " . $t['taskTitle'] . " (" . $t['taskStatus'] . ")<br>";
    }
} else {
    echo "No tasks found!";
}
?>
