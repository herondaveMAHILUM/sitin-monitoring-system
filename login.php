<?php
header('Content-Type: application/json');
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit;
    }

    $stmt = $conn->prepare("SELECT password, role FROM users WHERE email = ?");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 0) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    $stmt->bind_result($dbPassword, $role);
    $stmt->fetch();

    // Check if password is already hashed
    if (substr($dbPassword, 0, 4) !== '$2y$') {
        // It's plain text → hash it and update DB
        $hashedPassword = password_hash($dbPassword, PASSWORD_DEFAULT);
        $update = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
        $update->bind_param("ss", $hashedPassword, $email);
        $update->execute();
        $dbPassword = $hashedPassword; // replace plain text with hashed version
    }

    if (password_verify($password, $dbPassword)) {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "role" => $role
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Incorrect password"]);
    }
}
?>