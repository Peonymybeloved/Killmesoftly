<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';
require_once 'classes/Task.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

$task = new Task($conn);

if ($method === 'POST' && $action === 'create') {
    // Create a new task
    $data = json_decode(file_get_contents("php://input"), true);
    
    $taskTitle = isset($data['task']) ? trim($data['task']) : '';
    $deadline = isset($data['deadline']) ? trim($data['deadline']) : '';
    $status = isset($data['status']) ? trim($data['status']) : 'WIP';
    $course = isset($data['course']) ? trim($data['course']) : '';
    
    if (empty($taskTitle)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Task title is required']);
        exit;
    }
    
    // Convert status name to match DB values if needed
    $dbStatus = $status;
    
    if ($task->addTask($taskTitle, '', $deadline, $course, $dbStatus)) {
        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Task created successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create task']);
    }
} else if ($method === 'GET' && $action === 'list') {
    // Get all tasks (simplified - get all tasks in DB)
    $sql = "SELECT taskID, taskTitle, dueDate, taskStatus, taskCourse FROM tasks ORDER BY taskID DESC";
    $result = $conn->query($sql);
    
    if (!$result) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database query failed']);
        exit;
    }
    
    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = [
            'id' => $row['taskID'],
            'task' => $row['taskTitle'],
            'deadline' => $row['dueDate'],
            'status' => $row['taskStatus'],
            'course' => $row['taskCourse']
        ];
    }
    
    echo json_encode(['success' => true, 'data' => $tasks]);
} else if ($method === 'PUT' && $action === 'update') {
    // Update task status
    $data = json_decode(file_get_contents("php://input"), true);
    $taskID = isset($data['id']) ? intval($data['id']) : 0;
    $newStatus = isset($data['status']) ? trim($data['status']) : '';
    
    if ($taskID <= 0 || empty($newStatus)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid task ID or status']);
        exit;
    }
    
    $sql = "UPDATE tasks SET taskStatus=? WHERE taskID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $newStatus, $taskID);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to update task']);
    }
} else if ($method === 'DELETE' && $action === 'delete') {
    // Delete a task
    $data = json_decode(file_get_contents("php://input"), true);
    $taskID = isset($data['id']) ? intval($data['id']) : 0;
    
    if ($taskID <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid task ID']);
        exit;
    }
    
    $sql = "DELETE FROM tasks WHERE taskID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $taskID);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Task deleted successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to delete task']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid action or method']);
}

$conn->close();
?>
