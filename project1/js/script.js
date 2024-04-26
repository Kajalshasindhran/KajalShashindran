let polygons = [];
let capitalCity;
let capitalCityLat;
let capitalCityLng;
let weatherdescription = 'cloud';
let weatherImageURL;
let countryName;
let countryCode;
let currencyCode;
let exchangeInput;
let marker;
let geojsonLayer

let streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    }
);
  
let satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
);


//let map = L.map('map').setView([51.1657, 10.4515], 13);
let map = L.map('map', {
    layers: [streets] // Set the default layer when initializing the map
}).setView([51.1657, 10.4515], 13);

let tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 4,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let basemaps = {
    Streets: streets,
    Satellite: satellite,
};

let locationIcon = L.icon({
    iconUrl: './img/marker.svg',
    iconSize: [60, 60], // size of the icon
    iconAnchor: [16, 32], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // point from which the popup should open relative to the iconAnchor
});

let cityIcon = L.ExtraMarkers.icon({
    shape: "square",
    icon: "fa-city",
    prefix: "fa-solid",
    markerColor: "white",
    iconColor: "green"
});

let airportIcon = L.ExtraMarkers.icon({
    shape: 'square',
    icon: "fa-plane",
    prefix: "fa-solid",
    markerColor: "white",
    iconColor: "blue"
});

let universityIcon = L.ExtraMarkers.icon({
    shape: 'square',
    icon: "fa-graduation-cap",
    prefix: "fa-solid",
    markerColor: "white",
    iconColor: "orange"
});

let hospitalIcon = L.ExtraMarkers.icon({
    shape: 'square',
    icon: "fa-truck-medical",
    prefix: "fa-solid",
    markerColor: "white",
    iconColor: "red"
})

let cityMarkerCluster = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#0000FF",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
    },
});

let airportMarkerCluster = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
    },
});

let universityMarkerCluster = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#FF8C00",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.5,
    },
});

let hospitalMarkerCluster = L.markerClusterGroup({
    polygonOptions: {
        fillColor: "#fff",
        color: '#800000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5,
    }
});

let overlays = {
    Cities: cityMarkerCluster,
    Airports: airportMarkerCluster,
    University: universityMarkerCluster,
    Hospital: hospitalMarkerCluster
};

let layerControl = L.control.layers(basemaps, overlays).addTo(map);
//layerControl.addOverlay(cityMarkerCluster, 'Cities');

const getCountry = () => {
    $.ajax({
        type: "GET",
        url: "./php/getCountry.php",
        dataType: "json",
        success: (result) => {
            let countryData = result;
            let str = "";

            for (let i = 0; i < countryData.length; i++) {
                const countryInfo = countryData[i];
                str += `<option value="${countryInfo.iso2}">${countryInfo.name}</option>`;
            }
            $("#selectCountry").append(str);
            getGeoeolocation();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
    });
};

const getGeoeolocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            var latlng = new L.LatLng(lat, lng);
         
            //map.setView(latlng, 5);
      
            marker = L.marker([lat, lng], {icon: locationIcon}).addTo(map);

            getCountryByCoord(lat, lng);
        });
    }
    error: () => {
        alert('Could not locate the current location');
    }
};

const getCountryByCoord = (lat, lng) => {
    $.ajax({
        type: "GET",
        url: "./php/openCage.php",
        data: { 
            lat: lat, 
            lng: lng 
        },
        dataType: "json",
        success: (result) => {
            countryCodeFromOpenCage = result.data.results[0].components["ISO_3166-1_alpha-2"];
            
            $("#selectCountry").val(countryCodeFromOpenCage).change();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const removeBorders = () => {
    map.removeLayer(tile);
};

const getSingleCountryBorders = (isoCode) => {
    $.ajax({
        type: "GET",
        url: "./php/getBorder.php",
        data: { iso: isoCode },
        dataType: "json",
        success: (result) => {
            drawBorders(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        },
    });
};


const drawBorders = (country) => {
    let border = L.geoJSON(country).addTo(map);
    
    map.fitBounds(border.getBounds());
    
    let myStyle = {
        color: "#ff0000",
        weight: 5,
        opacity: 0.65,
    };

    let polygon = L.geoJSON(country, {
        style: myStyle,
        }).addTo(map);
    
    polygons.push(polygon);
};

const showCountryInfoModal = () => {
    const selectedCountry = $("#selectCountry").val();
    if (selectedCountry) {
        $.ajax({
            url: "./php/getCountryInfo.php",
            type: 'GET',
            dataType: 'json',
            data: { iso2: selectedCountry },
            success: function(result) {
                
                if (result.status.name == "ok") {
                    let country = result.data[0].countryName;
                    countryName = country.replace(/\s+/g, '_');
                    capitalCity = result.data[0].capital.toLowerCase();
                    countryCode = result.data[0].countryCode;

                    $('#txtCountry').html(result.data[0].countryName);
                    $('#txtCapital').html(result.data[0].capital);
                    $('#txtAreaInSqKm').html(result.data[0].areaInSqKm+ 'km²');
                    $('#txtContinent').html(result.data[0].continent);
                    $('#txtPopulation').html(result.data[0].population);
                    $('#txtLanguages').html(result.data[0].languages);
                    $('#txtCurrency').html(result.data[0].currencyCode);
                    getCurrentWeather(capitalCity);
                }
                getWikiLinks();

            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }
};

const mapWeatherImage = (description) => {
    switch(description.toLowerCase()) {
        case 'clouds':
            return './img/clouds.png'

        case 'few clouds':
            return './img/few-clouds.png'

        case 'scattered clouds':
            return './img/cloudy.png'

        case 'broken clouds':
            return './img/broken-cloud.png'

        case 'rain':
            return './img/raining.png'

        case 'thunder storm':
            return './img/storm.png'

        case 'snow':
            return './img/snow.png'

        default:
            return './img/sun.png'
    }
};

const getCurrentWeather = (capitalCity) => {
    $.ajax({
        url: "./php/getCurrentWeather.php",
        type: 'GET',
        dataType: 'json',
        data: { capital: capitalCity },
        success: function(result) {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            let month = tomorrow.toLocaleString('default', { month: 'long' });
            let date = tomorrow.getDate();

            let formattedDate = `${month} ${date}`;

            let dayAftertomorrow = new Date();
            dayAftertomorrow.setDate(dayAftertomorrow.getDate() + 2);

            let month2 = dayAftertomorrow.toLocaleString('default', { month: 'long' });
            let date2 = dayAftertomorrow.getDate();

            let nextFormattedDate = `${month2} ${date2}`;

            capitalCityLat = result.weatherData?.coord?.lat;
            capitalCityLng = result.weatherData?.coord?.lon;
    
            if (result.status.name === "ok") {
                weatherdescription = result.weatherData.weather[0].description;
                weatherImageURL = mapWeatherImage(weatherdescription);
                $('#icon-1').html('<img src="' + weatherImageURL + '">');
                $('#highestWeatherToday').html(result.weatherData.main.temp_max);
                $('#lowestWeatherToday').html(result.weatherData.main.temp_min);
                $('#description-1').html(result.weatherData.weather[0].description);
                $('#tomorrowDate').text(formattedDate);
                $('#dayafterTommorrowDate').text(nextFormattedDate);
            } 
            getWeatherForecast(capitalCityLat, capitalCityLng);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const getWeatherForecast = (lat, lng) => {
    $.ajax({
        url: "./php/getWeatherForecast.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng
        },
        success: function(result) {
                        
            if (result.status.name == "ok") {
                $('#highestWeatherT').html(result.weatherForcast.list[8].main.temp_max);
                $('#lowestWeatherT').html(result.weatherForcast.list[8].main.temp_min);
                $('#highestWeatherDT').html(result.weatherForcast.list[16].main.temp_max);
                $('#lowestWeatherDT').html(result.weatherForcast.list[16].main.temp_min);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const getWikiLinks = () => {
    $.ajax({
        url:'https://en.wikipedia.org/api/rest_v1/page/summary/' + countryName,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            $('#txtLink').html('<a href="' + result.content_urls.desktop.page + '" target="_blank">Link to Wikipedia</a>')
            $('#txtWikiImg').html('<img src=' + result.thumbnail.source +'><br>');
            $('#txtWiki').html(result.extract_html);
            restCountries();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const restCountries = () => {
    $.ajax({
        url: 'https://restcountries.com/v3.1/alpha/' + countryCode,
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            let currencies = result[0].currencies;
            currencyCode = Object.keys(currencies)[0];
            let currencyInfo = currencies[currencyCode];
            $('#txtcurrencyName').html(currencyInfo.name);
            $('#txtcurrencyCode').html(currencyCode);
            $('#txtcurrencySymbol').html(currencyInfo.symbol);
            $('#currencySymbol').html(currencyInfo.symbol);

            exchangeRate();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const exchangeRate = () => {
    $.ajax({
        url: './php/getExchangeRate.php',
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            if(result.status.name == 'ok') {
                let exchangeRate = result.exchangeRate.rates[currencyCode];
                let inputValue = $('#CurrencyExchangeInput').val();
                let resultValue = (inputValue * exchangeRate).toFixed(2);
                
                $('#CurrencyExchangeResult').val(resultValue);

                newsHeadlines(countryCode.toLowerCase());
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const newsHeadlines = (countryCodeNews) => {
    $.ajax({
        url: './php/getNewsHeadlines.php',
        type: 'GET',
        dataType: 'json',
        data: { countryCode : countryCodeNews },
        success: function(result) {

            let newsHeadlines = result.data.articles;
            let content = `<table class="table table-striped w-100 ">`;
            
            if (result.data.totalResults == 0) {
               $('#noNews').text("Sorry, the API doesn't have any article for this country");
            } 
            else if (result.data.status == 'ok') {
                for (i = 0; i < 7; i++) {
                    const topHeadline = newsHeadlines[i];
                    content += `<tbody>
                    <tr>
                    <td><a class="news-link" href="${topHeadline.url}" target="_blank">${topHeadline.title}</a></td>
                    </tr>`
                }
                content += "</table>";

                $("#news-info").append(content);
            }
            getCities(countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const getCities = (countryCodeCity) => {
    $.ajax({
        type: "GET",
        url: "./php/getCities.php",
        data: { countryCode: countryCodeCity },
        dataType: "json",
        success: (result) => {
            let cities = result.data;

            for (let i = 0; i < cities.length; i++) {
                let city = cities[i];
                let cityLat = city.lat;
                let cityLng = city.lng;
                let cityName = city.name;

                let marker = L.marker([cityLat, cityLng], {icon: cityIcon}).addTo(cityMarkerCluster);
                marker.bindTooltip(cityName).openPopup();
            }
            map.addLayer(cityMarkerCluster);
            getAirports(countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

const getAirports = (countryCodeAirport) => {
    $.ajax({
        type: 'GET',
        url: './php/getAirports.php',
        data: { countryCode: countryCodeAirport },
        dataType: 'json',
        success: (result) => {
            let airports = result.data;

            for (let i = 0; i < airports.length; i++) {
                let airport = airports[i];
                let airportLat = airport.lat;
                let airportLng = airport.lng;
                let airportname = airport.name;

                var marker = L.marker([airportLat, airportLng], { icon: airportIcon }).addTo(airportMarkerCluster);
                marker.bindTooltip(airportname).openPopup();
            }
            map.addLayer(airportMarkerCluster);
            getUniversity(countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

getUniversity = (countryCodeUniversity) => {
    $.ajax({
        type: 'GET',
        url: './php/getUniversity.php',
        data: { countryCode: countryCodeUniversity },
        dataType: 'json',
        success: (result) => {
            let universities = result.data;

            for (let i = 0; i < universities.length; i++) {
                let university = universities[i];
                let universityLat = university.lat;
                let universityLng = university.lng;
                let universityname = university.name;

                var marker = L.marker([universityLat, universityLng], { icon: universityIcon }).addTo(universityMarkerCluster);
                marker.bindTooltip(universityname).openPopup();
            }
            map.addLayer(universityMarkerCluster);
            getHospital(countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

getHospital = (countryCodeHospital) => {
    $.ajax({
        type: 'GET',
        url: './php/getHospitals.php',
        data: { countryCode: countryCodeHospital },
        dataType: 'json',
        success: (result) => {
            console.log('hospital', result);
            let hospitals = result.data;

            for (let i = 0; i < hospitals.length; i++) {
                let hospital = hospitals[i];
                let hospitalLat = hospital.lat;
                let hospitalLng = hospital.lng;
                let hospitalname = hospital.name;

                var marker = L.marker([hospitalLat, hospitalLng], { icon: hospitalIcon }).addTo(hospitalMarkerCluster);
                marker.bindTooltip(hospitalname).openPopup();
            }
            map.addLayer(hospitalMarkerCluster);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    });
};

$(document).ready(() => {

    L.easyButton("fa-circle-info", (btn, map) => {
        if ($("#selectCountry").val() === "") {
          alert("Please Select a Country");
        } else {
            $("#countryInfo").modal("show");

        }
    }).addTo(map);

    L.easyButton("fa-cloud-sun-rain", (btn, map) => {
        if ($("#selectCountry").val() === "") {
          alert("Please Select a Country");
        } else {
            $("#weatherInfo").modal("show");

        }
    }).addTo(map);

    L.easyButton("fa-globe", (btn, map) => {
        if ($("#selectCountry").val() === "") {
          alert("Please Select a Country");
        } else {
            $("#wikiInfo").modal("show");

        }
    }).addTo(map);

    L.easyButton("fa-money-check-dollar", (btn, map) => {
        if ($("#selectCountry").val() === "") {
          alert("Please Select a Country");
        } else {
            $("#exchangeInfo").modal("show");

        }
    }).addTo(map);

    L.easyButton("fa-newspaper", (btn, map) => {
        if ($("#selectCountry").val() === "") {
          alert("Please Select a Country");
        } else {
            $("#newsInfo").modal("show");

        }
    }).addTo(map);

    getCountry();
    
    $("#selectCountry").change(function() {
        var selectedISO = $(this).val(); 

        if (selectedISO) {
            removeBorders();
            getSingleCountryBorders(selectedISO);
            showCountryInfoModal(); 
            $('#CurrencyExchangeInput').val(1);
            $("#news-info").html(null);
            $("#noNews").html(null);
        }
    });

    $('#CurrencyExchangeInput').on('input', function () {
       exchangeRate();
    });
});

