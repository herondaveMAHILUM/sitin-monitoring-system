<?php
session_start();
include "db.php";

$userEmail = $_SESSION['email'] ?? '';
if($userEmail == ''){
    echo json_encode(['error' => 'No user logged in']);
    exit;
}

$sql = "SELECT * FROM users WHERE email='$userEmail'";
$result = $conn->query($sql);

if($result->num_rows > 0){
    $user = $result->fetch_assoc();
    
    // Optional: calculate "Year" from course level
    $year = $user['course_level']; // You can map 1=>First Year, etc.

    echo json_encode([
        'name' => $user['first_name'].' '.$user['middle_name'].' '.$user['last_name'],
        'course' => $user['course'],
        'year' => $year,
        'email' => $user['email'],
        'address' => $user['address'],
        'sessions' => '0', // You can update later if you track sessions
    ]);
} else {
    echo json_encode(['error' => 'User not found']);
}
?>