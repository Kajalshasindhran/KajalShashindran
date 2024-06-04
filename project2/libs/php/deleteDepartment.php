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

	$checkQuery = $conn->prepare('SELECT * FROM personnel WHERE departmentID = ?');
	$checkQuery->bind_param("i", $_REQUEST['id']);
	$checkQuery->execute();
	$checkQuery->store_result();

	if ($checkQuery->num_rows > 0) {
    	$output['status']['code'] = "405";
    	$output['status']['name'] = "Method Not Allowed";
    	$output['status']['description'] = "department has dependencies";
    	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    	$output['data'] = [];

    	$checkQuery->close();
    	$conn->close();

    	echo json_encode($output);
    	exit;
	}

	$checkQuery->close();
	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	
	$query->bind_param("i", $_REQUEST['id']);

	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>