<?php

  header('Content-Type: application/json; charset=UTF-8');
  header('Access-Control-Allow-Origin: *');	

	$executionStartTime = microtime(true);

  $url="https://api.weatherapi.com/v1/forecast.json?key==" . $_REQUEST['location'] . "&days=3";

	$ch = curl_init();

	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result = curl_exec($ch);

  $cURLERROR = curl_errno($ch);
  
  curl_close($ch);

	if ($cURLERROR) {
    
    $output['status']['code'] = $cURLERROR;
    $output['status']['name'] = "Failure - cURL";
    $output['status']['description'] = curl_strerror($cURLERROR);
		$output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
		$output['data'] = null;
  } else {

    $weather = json_decode($result,true);

  if (json_last_error() !== JSON_ERROR_NONE) {

    $output['status']['code'] = json_last_error();
    $output['status']['name'] = "Failure - JSON";
    $output['status']['description'] = json_last_error_msg();
	  $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
		$output['data'] = null;
    } else {
  
      if (isset($weather['error'])) {

        $output['status']['code'] = $weather['error']['code'];
        $output['status']['name'] = "Failure - API";
        $output['status']['description'] = $weather['error']['message'];
  	  	$output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
	  	  $output['data'] = null;

      } else {

        $finalResult['country'] = $weather['location']['country'];
        $finalResult['location'] = $weather['location']['name'];
        $finalResult['lastUpdated'] = $weather['current']['last_updated'];
        $finalResult['forecast'] = [];

        foreach ($weather['forecast']['forecastday'] as $item) {

          $temp['date'] = $item['date'];

          $temp['minC'] = intval($item['day']['mintemp_c']);
          $temp['maxC'] = intval($item['day']['maxtemp_c']);

          $temp['conditionText'] = $item['day']['condition']['text'];
          $temp['conditionIcon'] = 'https:' . $item['day']['condition']['icon'];

          array_push($finalResult['forecast'], $temp);          

        }

        $output['status']['code'] = 200;
     		$output['status']['name'] = "ok";
        $output['status']['description'] = "all ok";
  	  	$output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
	  	  // $output['data'] = $weather;
        $output['data'] = $finalResult;

      }

    }

	}

	echo json_encode($output, JSON_NUMERIC_CHECK); 

?>