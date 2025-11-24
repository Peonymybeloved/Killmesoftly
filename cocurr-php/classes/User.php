<?php
class User {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function register($username, $email, $password) {
        $password = password_hash($password, PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sss", $username, $email, $password);
        return $stmt->execute();
    }

    public function login($email, $password) {
        $sql = "SELECT * FROM users WHERE email=?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($password, $user['password'])) {
            return true;
        }
        return false;
    }

    public function logout() {
        session_destroy();
        return true;
    }
}
?>
