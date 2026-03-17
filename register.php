<?php
include "db.php";

$id = $_POST['idNumber'];
$last = $_POST['lastName'];
$first = $_POST['firstName'];
$middle = $_POST['middleName'];
$level = $_POST['courseLevel'];
$course = $_POST['course'];
$email = $_POST['email'];
$password = $_POST['password'];
$address = $_POST['address'];

$sql = "INSERT INTO users 
(id_number, last_name, first_name, middle_name, course_level, course, email, password, address)
VALUES 
('$id','$last','$first','$middle','$level','$course','$email','$password','$address')";

if ($conn->query($sql) === TRUE) {
    echo "success";
} else {
    echo "error";
}
?>