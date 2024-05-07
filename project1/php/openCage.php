<?php

    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');	

    $executionStartTime = microtime(true);
    
    $url = "https://api.opencagedata.com/geocode/v1/json?q=". $_REQUEST['lat']. "+" . $_REQUEST['lng']. "&key=3743bcf7843e430b9f4dc55e0d0e4028"
        . "&language=en&pretty=1";

    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    $cURLERROR = curl_errno($ch);

    curl_close($ch);

    //$decode = json_decode($result, true); 

    // $output['status']['code'] = "200";
    // $output['status']['name'] = "ok";
    // $output['status']['description'] = "success";
    // $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    //$output['data'] = $decode;
    //$output['data']= $decode['results'][0]['components'];

    //echo json_encode($output);
    
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
                    $output['data']= $decode['results'][0]['components'];
                }
    
                $output['status']['code'] = "200";
                $output['status']['name'] = "ok";
                $output['status']['description'] = "success";
                $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    
        }
    
        
    
    }
    
    echo json_encode($output, JSON_NUMERIC_CHECK); 
?>