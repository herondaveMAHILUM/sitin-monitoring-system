<?php
session_start();
include "db.php";

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);

if($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    
    // save user info in session
    $_SESSION['email'] = $user['email']; // or 'id' if you prefer

    if($user['role'] == 'admin'){
        echo "admin";
    } else {
        echo "user";
    }
} else {
    echo "invalid";
}
?>