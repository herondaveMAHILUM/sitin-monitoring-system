<?php
$conn = new mysqli("localhost", "root", "", "sitin_system");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>