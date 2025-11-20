<?php
class Task {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Add a new task
    public function addTask($title, $description, $dueDate, $course) {
        $status = "Pending";
        $sql = "INSERT INTO tasks (taskTitle, taskDescription, dueDate, taskStatus, taskCourse)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssss", $title, $description, $dueDate, $status, $course);
        return $stmt->execute();
    }

    // Mark a task as completed
    public function completed($taskID) {
        $sql = "UPDATE tasks SET taskStatus='Completed' WHERE taskID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $taskID);
        return $stmt->execute();
    }

    // Update task details
    public function updateDetails($taskID, $newTitle, $newDesc, $newDueDate) {
        $sql = "UPDATE tasks SET taskTitle=?, taskDescription=?, dueDate=? WHERE taskID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssi", $newTitle, $newDesc, $newDueDate, $taskID);
        return $stmt->execute();
    }

    // Get the status of a task
    public function getStatus($taskID) {
        $sql = "SELECT taskStatus FROM tasks WHERE taskID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $taskID);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row['taskStatus'];
    }
}
?>
