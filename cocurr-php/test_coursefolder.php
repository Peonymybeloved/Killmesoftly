<?php
include "db.php";
include __DIR__ . "/classes/CourseFolder.php";

$cf = new CourseFolder($conn);

// Add a new test course
if ($cf->addCourse("Software Engineering", "Intro to SE concepts", "Prof. Santos", "9:00 AM", "Monday")) {
    echo "✅ Course added successfully!<br><br>";
} else {
    echo "❌ Error adding course!<br><br>";
}

// Show all courses
$courses = $cf->viewCourses();

if (count($courses) > 0) {
    echo "✅ Showing all courses:<br><br>";
    foreach ($courses as $c) {
        echo "- " . $c['courseName'] . " (" . $c['teacher'] . ") on " . $c['courseDay'] . "<br>";
    }
} else {
    echo "No courses found!";
}
?>
