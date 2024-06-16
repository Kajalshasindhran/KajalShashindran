<?php

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$departmentId = isset($_POST['departmentId']) ? $_POST['departmentId'] : '';
$locationId = isset($_POST['locationId']) ? $_POST['locationId'] : '';

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    echo json_encode($output);
    exit;
}

$query = 'SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, p.departmentID, d.name AS departmentName, l.name as locationName
          FROM personnel p
          LEFT JOIN department d ON (d.id = p.departmentID)
          LEFT JOIN location l ON (l.id = d.locationID)
          WHERE 1=1';

$params = [];
$types = '';

if (!empty($departmentId)) {
    $query .= ' AND p.departmentID = ?';
    $params[] = $departmentId;
    $types .= 'i';
}

if (!empty($locationId)) {
    $query .= ' AND d.locationID = ?';
    $params[] = $locationId;
    $types .= 'i';
}

$stmt = $conn->prepare($query);

if ($types) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();

$result = $stmt->get_result();

if (!$result) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "query failed";
    echo json_encode($output);
    exit;
}

$employees = [];
while ($row = $result->fetch_assoc()) {
    array_push($employees, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['data'] = $employees;

$conn->close();

echo json_encode($output);
?>