<?php
include "db.php";
include __DIR__ . "/classes/Calendar.php";

$calendar = new Calendar($conn);

echo "✅ Tasks due on 2025-11-15:<br>";
$tasks = $calendar->tasksOnDay("2025-11-15");

if (count($tasks) > 0) {
    foreach ($tasks as $t) {
        echo "- " . $t['taskTitle'] . " (" . $t['taskStatus'] . ")<br>";
    }
} else {
    echo "No tasks found for this date.<br>";
}

echo "<br>📚 Classes on Monday:<br>";
$courses = $calendar->classesOnDay("Monday");

if (count($courses) > 0) {
    foreach ($courses as $c) {
        echo "- " . $c['courseName'] . " at " . $c['time'] . " with " . $c['teacher'] . "<br>";
    }
} else {
    echo "No classes found for Monday.<br>";
}

echo "<br>📅 Weekly Overview:<br>";
$overview = $calendar->weeklyOverview();

foreach ($overview as $o) {
    echo "- " . $o['courseDay'] . ": " . $o['courseName'] . " at " . $o['time'] . "<br>";
}
?>
