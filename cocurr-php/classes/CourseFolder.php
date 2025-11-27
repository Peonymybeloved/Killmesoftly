<?php
class CourseFolder {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Add new course
    public function addCourse($name, $desc, $teacher, $time, $day) {
        $sql = "INSERT INTO courses (courseName, courseDescription, teacher, time, courseDay)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssss", $name, $desc, $teacher, $time, $day);
        return $stmt->execute();
    }

    // Edit existing course
    public function editCourse($courseID, $update) {
        $sql = "UPDATE courses SET courseName=?, courseDescription=?, teacher=?, time=?, courseDay=? WHERE courseID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssi", $update['name'], $update['desc'], $update['teacher'], $update['time'], $update['day'], $courseID);
        return $stmt->execute();
    }

    // Delete a course
    public function deleteCourse($courseID) {
        $sql = "DELETE FROM courses WHERE courseID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $courseID);
        return $stmt->execute();
    }

    // View all courses
    public function viewCourses() {
        $sql = "SELECT * FROM courses";
        $result = $this->conn->query($sql);
        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
        return $courses;
    }
}
?>
