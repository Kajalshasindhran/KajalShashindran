let polygons = [];
let markers = [];
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
let border;

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


let map = L.map('map').setView([51.1657, 10.4515], 13);

let tile = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 4,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let basemaps = {
    Default: tile,
    Streets: streets,
    Satellite: satellite,
};

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
    Hospital: hospitalMarkerCluster
};

let layerControl = L.control.layers(basemaps, overlays).addTo(map);

const getCountry = () => {
    $.ajax({
        type: "GET",
        url: "./php/getCountries.php",
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
            alert("Error occurred while fetching country data: " + textStatus);
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

            countryCodeFromOpenCage = result.data['ISO_3166-1_alpha-2'];
            $("#selectCountry").val(countryCodeFromOpenCage).change();

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching country ISO2 code: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};


const getSingleCountryBorders = (isoCode) => {
    $.ajax({
        type: "GET",
        url: "./php/getCountries.php",
        data: { iso: isoCode },
        dataType: "json",
        success: (result) => {
            drawBorders(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching country borders: " + textStatus);
            console.log(textStatus, errorThrown);
        },
    });
};

const drawBorders = (country) => {

    border = L.geoJSON(country).addTo(map);
    
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

const removeBorders = () => {
    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) map.removeLayer(layer);
    });
};

const removeAllMarkers = () => {
    markers.forEach(marker => {
        map.removeLayer(marker); 
    });
};

const removeMarkerClusters = () => {
    cityMarkerCluster.clearLayers();
    hospitalMarkerCluster.clearLayers();
    airportMarkerCluster.clearLayers();
}

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
                    let city = result.data[0].capital.toLowerCase();
                    capitalCity = city.replace(/\s+/g, '_');
                    countryCode = result.data[0].countryCode;
                    currencyCode = result.data[0].currencyCode
                    $('#txtCountry').html(result.data[0].countryName);
                    $('#txtCapital').html(result.data[0].capital);
                    $('#txtAreaInSqKm').html(result.data[0].areaInSqKm+ 'km²');
                    $('#txtContinent').html(result.data[0].continent);

                    let formattedPopulation = numeral(result.data[0].population).format('0,0');
                    $('#txtPopulation').html(formattedPopulation);
                    $('#txtLanguages').html(result.data[0].languages);
                    $('#txtCurrency').html(result.data[0].currencyCode);
                    $('#exhchangeCode').html(result.data[0].currencyCode);
                    getWeather(capitalCity);
                }
                getWikiLinks(countryName);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error occurred while fetching country info: " + textStatus);
                console.log(textStatus, errorThrown);
            }
        });
    }
};

const getWeather = (location) => {
    $.ajax({
        url: "./php/getWeather.php",
        type: 'GET',
        dataType: 'json',
        data: {
            location: location,
        },
        success: function(result) {

            if (result.status.name == "ok") {
            
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

                $('#weatherCapital').html(result.data.location + ", " + result.data.country);
                $('#highestWeatherToday').html(result.data.forecast[0].maxC);
                $('#highestWeatherT').html(result.data.forecast[1].maxC);
                $('#lowestWeatherT').html(result.data.forecast[1].minC);
                $('#highestWeatherDT').html(result.data.forecast[2].maxC);
                $('#lowestWeatherDT').html(result.data.forecast[2].minC);
                $('#tomorrowDate').text(formattedDate);
                $('#dayafterTommorrowDate').text(nextFormattedDate);
                $('#description-1').html(result.data.forecast[0].conditionText);
                $('#icon-1').attr("src", result.data.forecast[0].conditionIcon);
                $('#icon-2').attr("src", result.data.forecast[1].conditionIcon);
                $('#icon-3').attr("src", result.data.forecast[2].conditionIcon);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching weather info: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

const getWikiLinks = (country) => {
    $.ajax({
        url: './php/getWikipedia.php',
        type: 'GET',
        dataType: 'json',
        data: { country: country},
        success: function(result) {
            if (result.status.name == "ok") {

                $('#txtLink').html('<a href="' + result.data.content_urls.desktop.page + '" target="_blank">Link to Wikipedia</a>')
                $('#txtWikiImg').html('<img src=' + result.data.thumbnail.source +'><br>');
                $('#txtWiki').html(result.data.extract_html);
            }
            exchangeRate();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching Wikipedia: " + textStatus);
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
            alert("Error occurred while fetching Exchange Rate: " + textStatus);
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
                for (i = 0; i < 4; i++) {
                    let topHeadline = newsHeadlines[i];
                    content += `<tbody>
                    <tr>
                        <td>
                            <img src="${topHeadline.urlToImage || './img/news.jpg'}" style="width: 100px; height: 100px;" />
                        </td>
                        <td ><a style="color: black" class="news-link" href="${topHeadline.url}" target="_blank">${topHeadline.title}</a></td>
                    </tr>`
                }
                content += "</table>";

                $("#news-info").append(content);
            }
            getCities(countryCode);
            getAirports(countryCode);
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching News Headlines: " + textStatus);
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
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching cities: " + textStatus);
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
            getHospital(countryCode);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching airports: " + textStatus);
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
            let hospitals = result.data;

            for (let i = 0; i < hospitals.length; i++) {
                let hospital = hospitals[i];
                let hospitalLat = hospital.lat;
                let hospitalLng = hospital.lng;
                let hospitalname = hospital.name;

                var marker = L.marker([hospitalLat, hospitalLng], { icon: hospitalIcon }).addTo(hospitalMarkerCluster);
                marker.bindTooltip(hospitalname).openPopup();
            }
            $('#preloader').fadeOut('slow');

        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Error occurred while fetching hospitals: " + textStatus);
            console.log(textStatus, errorThrown);
        }
    });
};

window.addEventListener("load", function() {
    var preloader = document.getElementById("preloader");
    setTimeout(function() {
      preloader.style.display = "none";
    }, 5000);
});


$(document).ready(() => {

    $('#preloader').show();


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
            if (polygons !== undefined) {
                removeBorders();
            };
            removeAllMarkers();
            removeMarkerClusters();
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