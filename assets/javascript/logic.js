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
      var newRow =  "<div class='row mb-4'>" + 
                      "<div class='col-sm-6'>" +
                        "<div class='card'>" + 
                          "<div class='card-body'>" + 
                            "<h5 class='card-title'>" + trails[i].name + "</h5>" +
                            "<p class='card-text'>" + trails[i].summary + "<br><br>" + "Difficulty: " + trails[i].difficulty +
                            "</p>" +
                          "</div>" +
                        "</div>" +
                      "</div>" +
                      "<div class='col-sm-6'>" +
                        "<div class='card'>" + 
                          "<div class='card-body'>" + 
                            "<h5 class='card-title'>" + weatherArray[i].main.temp + "</h5>" +
                            "<h6>" + weatherArray[i].weather[0].description + "</h6>" +
                            "<p class='card-text'>High: " + weatherArray[i].main.temp_max + " Low: " + weatherArray[i].main.temp_min + " Wind Speed: " + weatherArray[i].wind.speed +
                            "</p>" +
                          "</div>" +
                        "</div>" +
                      "</div>" +
                    "</div>"
      $("#cards").append(newRow);
    }
  }

var difficulty = $("<img>").attr("src", "assets/images/difficulty_legend.png");
$("#legend").html(difficulty);

}

