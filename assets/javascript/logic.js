var autocomplete;
var place;
var placeLat;
var placeLng;
var trails;
var weatherArray = [];
var currentTrailWeather;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode'],
      componentRestrictions: {'country': 'us'}
      });
};

function getCoordinates() {
  // Get the place details from the autocomplete object.
  place = autocomplete.getPlace();
  placeLat = place.geometry.location.lat();
  placeLng = place.geometry.location.lng();
};

$("#inputForm").on("submit", function getTrails(e) {
  e.preventDefault();
  if (autocomplete.getPlace()) {
    getCoordinates();
    var hikingAPIKey = "200369551-f5e549a41b82ef52b84c357cbcf68e68";
    var queryURL = "https://www.hikingproject.com/data/get-trails?lat=" + placeLat + "&lon=" + placeLng + "&maxDistance=30&maxResults=5&key=" + hikingAPIKey
    $.ajax({
      url: queryURL,
      method: "GET"
    })
    .then(function(trailsRetrieved) {
      console.log(trailsRetrieved);
      trails = trailsRetrieved.trails;
      console.log(trails);
      getWeather(trails);
    });
  }
});

function getWeather(trails) {
  var weatherAPIKey = "01d0b60949b02d482247e5118575c512";
  for (var i = 0; i < trails.length; i++) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + trails[i].latitude + "&lon=" + trails[i].longitude + "&units=imperial&appid=" + weatherAPIKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    })
    .then(function(currentTrailWeatherResult) {  
      console.log(currentTrailWeatherResult);
      weatherArray.push(currentTrailWeatherResult);
      console.log(weatherArray);
      renderTrails();
    });
  }
  initAutocomplete();
};

function renderTrails() {
  if(weatherArray.length === trails.length) {
    $("#cards").empty();
    for (var i = 0; i < trails.length; i++) {
        var newRow =  "<div class='card-wrapper'>" +
        
        "<div class='heading-wrapper'>" +
            "<div class='trail-name-wrapper'>" +
                "<h2>" + trails[i].name + "</h2>" +
            "</div>" +
            "<div class='button-wrapper'>" +
                "<a class='btn btn-light' href=" + trails[i].url + "role='button'>" + "Learn More" + "</a>" +
            "</div>" +
        "</div>" +

        "<div class='information-wrapper'>" +
            "<div class='image-wrapper'>" +
            "<img src=" + trails[i].imgSqSmall + ">" +
            "</div>" +
            "<div class='trail-info-wrapper'>" +
                "<div>" +
                    "<div class='summary'>" +
                        "<p>" + trails[i].summary +
                        "</p>" + 
                    "</div>" +
                    "<hr>" +
                    "Level of difficulty: " + trails[i].difficulty + "." +
                    "<hr>" + "Distance: " + trails[i].length + " miles" +
                    "<hr>" + "Trail Status: " + trails[i].conditionDetails + "." +
                "</div>" +
            "</div>" +
            "<div class='weather-wrapper'>" +
                
                "<div class='temp-wrapper'>" +
                    "<div class='temp-value-wrapper'>" + weatherArray[i].main.temp + "&#176" +
                "</div>" +
                "</div>" +
                "<div class='icon-wrapper'>" +
                "<img src='http://openweathermap.org/img/w/" + weatherArray[i].weather[0].icon + ".png'>" +
                "</div>" +
                "<div class='wind-wrapper'>" +
                    "<div class='cloud-icon-wrapper'>" +
                        "<img src='../images/wind.png' alt=''>" +
                    "</div>" +
                    "<div class='wind-data-wrapper'>" +
                        "<p>" + weatherArray[i].wind.speed +" mph" + "</p>" +
                    "</div>" +
                "</div>" +    
                    "<div class='conditions-wrapper'>" +
                        "<p>" + "Current conditions: " + "<br>" + weatherArray[i].weather[0].main + "." + "</p>" +
                    "</div>" +
            "</div>" +
        "</div>" +
    "</div>";
     $("#cards").append(newRow);
    }
  }
}
