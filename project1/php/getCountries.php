<?php

$jsonString = file_get_contents('../data/countryBorders.geo.json');
$data = json_decode($jsonString, true);

if (isset($_REQUEST['iso'])) {

  foreach ($data['features'] as $country) {
    if ($country['properties']['iso_a2'] == $_REQUEST['iso']) {
      echo json_encode($country);
      exit; 
    }
}
} else {
    $countries = [];
    foreach ($data['features'] as $feature) {
      $countryName = $feature['properties']['name'];
      $iso2 = $feature['properties']['iso_a2'];
      $countries[] = ['name' => $countryName, 'iso2' => $iso2];
    }

    // Sort country names alphabetically
    usort($countries, function ($a, $b) {
        return strcmp($a['name'], $b['name']);
    });

    header('Content-Type: application/json');
    echo json_encode($countries);
}
?>