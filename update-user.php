<?php
session_start();
include "db.php";

$userEmail = $_SESSION['email'] ?? '';
if($userEmail == ''){
    echo "error";
    exit;
}

// Get POST data
$idNumber = $_POST['idNumber'];
$lastName = $_POST['lastName'];
$firstName = $_POST['firstName'];
$middleName = $_POST['middleName'];
$courseLevel = $_POST['courseLevel'];
$password = $_POST['password'];
$email = $_POST['email'];
$course = $_POST['course'];
$address = $_POST['address'];

// Update query
$sql = "UPDATE users SET 
    id_number='$idNumber',
    last_name='$lastName',
    first_name='$firstName',
    middle_name='$middleName',
    course_level='$courseLevel',
    password='$password',
    course='$course',
    address='$address'
    WHERE email='$userEmail'";

if($conn->query($sql) === TRUE){
    echo "success";
} else {
    echo "error";
}
?>