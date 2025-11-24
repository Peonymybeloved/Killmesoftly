<?php
class Calendar {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Show all tasks on a given date
    public function tasksOnDay($date) {
        $sql = "SELECT taskTitle, taskStatus FROM tasks WHERE dueDate=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $date);
        $stmt->execute();
        $result = $stmt->get_result();

        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        return $tasks;
    }

    // Show all classes on a given day
    public function classesOnDay($day) {
        $sql = "SELECT courseName, time, teacher FROM courses WHERE courseDay=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $day);
        $stmt->execute();
        $result = $stmt->get_result();

        $courses = [];
        while ($row = $result->fetch_assoc()) {
            $courses[] = $row;
        }
        return $courses;
    }

    // Display a weekly overview
    public function weeklyOverview() {
        $sql = "SELECT courseDay, courseName, time FROM courses ORDER BY courseDay";
        $result = $this->conn->query($sql);

        $overview = [];
        while ($row = $result->fetch_assoc()) {
            $overview[] = $row;
        }
        return $overview;
    }
}
?>
