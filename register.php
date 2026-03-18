<?php
header('Content-Type: application/json');
include "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $idNumber = $_POST['idNumber'];
    $lastName = $_POST['lastName'];
    $firstName = $_POST['firstName'];
    $middleName = $_POST['middleName'];
    $courseLevel = $_POST['courseLevel'];
    $course = $_POST['course'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $password = $_POST['password'];
    $confirmPassword = $_POST['confirmPassword'];

    // VALIDATION
    if (empty($idNumber) || empty($lastName) || empty($firstName) || empty($courseLevel) || empty($course) || empty($email) || empty($address) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "All fields are required"]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["status" => "error", "message" => "Invalid email format"]);
        exit;
    }

    if ($password !== $confirmPassword) {
        echo json_encode(["status" => "error", "message" => "Passwords do not match"]);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters"]);
        exit;
    }

    // CHECK EXISTING EMAIL OR ID
    $check = $conn->prepare("SELECT id FROM users WHERE email = ? OR id_number = ?");
    $check->bind_param("ss", $email, $idNumber);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email or ID already exists"]);
        exit;
    }

    // HASH PASSWORD
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (id_number, last_name, first_name, middle_name, course_level, course, email, address, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(["status" => "error", "message" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("sssssssss", $idNumber, $lastName, $firstName, $middleName, $courseLevel, $course, $email, $address, $hashedPassword);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Registration successful"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed: " . $stmt->error]);
    }
}
?>