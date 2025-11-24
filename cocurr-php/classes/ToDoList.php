<?php
class ToDoList {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Add a new task
    public function addTask($task) {
        return $task;
    }

    // Edit an existing task
    public function editTask($taskID, $update) {
        $sql = "UPDATE tasks SET taskTitle=?, taskDescription=?, dueDate=?, taskCourse=? WHERE taskID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssi", $update['title'], $update['description'], $update['dueDate'], $update['course'], $taskID);
        return $stmt->execute();
    }

    // Delete a task
    public function deleteTask($taskID) {
        $sql = "DELETE FROM tasks WHERE taskID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $taskID);
        return $stmt->execute();
    }

    // View all tasks
    public function viewTasks() {
        $sql = "SELECT * FROM tasks";
        $result = $this->conn->query($sql);
        $tasks = [];
        while ($row = $result->fetch_assoc()) {
            $tasks[] = $row;
        }
        return $tasks;
    }

    // Toggle task completion
    public function toggleCompleted($taskID) {
        $sql = "UPDATE tasks SET taskStatus = IF(taskStatus='Completed', 'Pending', 'Completed') WHERE taskID=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $taskID);
        return $stmt->execute();
    }
}
?>
