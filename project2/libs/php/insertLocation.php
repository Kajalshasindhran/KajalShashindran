<?php

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    echo json_encode($output);
    exit;
}

// Check for duplicate entry
$checkQuery = $conn->prepare('SELECT * FROM location WHERE name = ?');
$checkQuery->bind_param("s", $_POST['name']);
$checkQuery->execute();
$checkQuery->store_result();

if ($checkQuery->num_rows > 0) {
    $output['status']['code'] = "409";
    $output['status']['name'] = "conflict";
    $output['status']['description'] = "duplicate entry";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    $checkQuery->close();
    $conn->close();

    echo json_encode($output);
    exit;
}

$checkQuery->close();

// Prepare the SQL insert statement
$query = $conn->prepare('INSERT INTO location (name) VALUES (?)');
$query->bind_param("s", $_POST['name']);

// Execute the query and check for errors
if ($query->execute()) {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
} else {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query failed";
}

$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

$query->close();
$conn->close();

echo json_encode($output);
?>