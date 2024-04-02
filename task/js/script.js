$('#submitTime').click(function() {
 
    $.ajax({
        url: "php/getTimezoneInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
 
            lat: $('#latitude').val(),
            lng: $('#longitude').val()
        },
        success: function(result) {
 
            console.log(JSON.stringify(result));
 
            if (result.status.name == "ok") {
                $('#countryCode').html(result.data['countryCode']);
                $('#countryName').html(result.data['countryName']);
                $('#timezoneId').html(result.data['timezoneId']);
                $('#time').html(result.data['time']);
            }
 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error:", errorThrown);
        }
    }); 
 
});
 
 
$('#submitOcean').click(function() {
    $.ajax({
        url: "php/getOcean.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#latitude-two').val(),
            lng: $('#longitude-two').val()
        },
        success: function(result) {
 
            console.log(JSON.stringify(result));
 
            if (result.status.name == "ok") {
 
                    $('#distance').html(result.data['distance']);
                    $('#name').html(result.data['name']);
 
                }
 
 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error:", errorThrown);
        }
    }); 
 
});
 
 
$('#submitWeather').click(function() {
    $.ajax({
        url: "php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            icao: $('#weather-code').val(),
        },
        success: function(result) {
 
            console.log(JSON.stringify(result));
 
            if (result.status.name == "ok") {
 
                    $('#temperature').html(result.data['temperature']);
                    $('#humidity').html(result.data['humidity']);
                    $('#windSpeed').html(result.data['windSpeed']);
 
                }
 
 
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error:", errorThrown);
        }
    }); 
 
});