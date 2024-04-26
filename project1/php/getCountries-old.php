<?php

// Read JSON file
$jsonString = file_get_contents('../data/countryBorders.geo.json');
$data = json_decode($jsonString, true);


// Extract country names and ISO2 codes
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

// Send JSON response
header('Content-Type: application/json');
echo json_encode($countries);
?>