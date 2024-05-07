<?php

	header('Content-Type: application/json; charset=UTF-8');
	header('Access-Control-Allow-Origin: *');

	$executionStartTime = microtime(true);
    $url='https://en.wikipedia.org/api/rest_v1/page/summary/'. $_REQUEST['country'];
    
    $ch = curl_init();

	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	$cURLERROR = curl_errno($ch);

	curl_close($ch);
	
	if ($cURLERROR) {
    
        $output['status']['code'] = $cURLERROR;
        $output['status']['name'] = "Failure - cURL";
        $output['status']['description'] = curl_strerror($cURLERROR);
        $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
        $output['data'] = null;
    } else {
    
        $decode = json_decode($result,true);
    
        if (json_last_error() !== JSON_ERROR_NONE) {
    
            $output['status']['code'] = json_last_error();
            $output['status']['name'] = "Failure - JSON";
            $output['status']['description'] = json_last_error_msg();
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            $output['data'] = null;
            } else {
      
                if (isset($decode['error'])) {
    
                    $output['status']['code'] = $decode['error']['code'];
                    $output['status']['name'] = "Failure - API";
                    $output['status']['description'] = $decode['error']['message'];
                    $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
                    $output['data'] = null;
    
                } else {
					$output['data'] = $decode;
				}
    
			$output['status']['code'] = "200";
			$output['status']['name'] = "ok";
			$output['status']['description'] = "success";
			$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    
        }
    
    }
    
    echo json_encode($output, JSON_NUMERIC_CHECK);

?>