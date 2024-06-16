<?php
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

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

		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}	

	$checkQuery = $conn->prepare('SELECT COUNT(p.id) as employeeCount, d.name as departmentName FROM personnel p LEFT JOIN department d ON (p.departmentID = d.id) WHERE d.id = ? GROUP BY d.id');
	$checkQuery->bind_param("i", $_POST['id']);
	$checkQuery->execute();
	
	if (false === $checkQuery) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		$checkQuery->close();
		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}

    $result = $checkQuery->get_result();

   	$department = [];

	while ($row = $result->fetch_assoc()) {
		array_push($department, $row);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $department;
	
	$checkQuery->close();
	mysqli_close($conn);

	echo json_encode($output); 

?>