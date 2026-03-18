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

    $stmt = $conn->prepare("SELECT id_number, last_name, first_name, middle_name, course_level, course, email, address, password, role FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "User not found"]);
        exit;
    }

    $stmt->bind_result($idNumber, $lastName, $firstName, $middleName, $courseLevel, $course, $dbEmail, $address, $dbPassword, $role);
    $stmt->fetch();

    if (password_verify($password, $dbPassword)) {
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "role" => $role,
            "user" => [
                "idNumber" => $idNumber,
                "lastName" => $lastName,
                "firstName" => $firstName,
                "middleName" => $middleName,
                "courseLevel" => $courseLevel,
                "course" => $course,
                "email" => $dbEmail,
                "address" => $address
            ]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Incorrect password"]);
    }
}
?>