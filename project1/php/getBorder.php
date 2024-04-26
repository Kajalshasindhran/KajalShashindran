<?php

// Check if the 'iso' parameter is set in the request
if (isset($_REQUEST['iso'])) {
    $geoJsonData = file_get_contents('../data/countryBorders.geo.json');

    $countries = json_decode($geoJsonData, true);

    foreach ($countries['features'] as $country) {

        if ($country['properties']['iso_a2'] == $_REQUEST['iso']) {

            echo json_encode($country);

            break;
        }
    }
}
?>