/**
 * Created by hidin on 7/28/2017.
 */
// http://oopstyle.net/wp-content/uploads/2017/06/City-Background-Night-Street-RO.jpg - night main background

"use strict";

var weatherData;
var currentTempUnit = "c";

function getFahrenheitTemp(data) {
  $(".info--currentT").prepend((data.main.temp * 1.8) + 32);
  $(".info--maxT").prepend((data.main.temp_max * 1.8) + 32);
  $(".info--minT").prepend((data.main.temp_min * 1.8) + 32);
}
function getCelsiusTemp(data) {
  $(".info--currentT").prepend(data.main.temp);
  $(".info--maxT").prepend(data.main.temp_max);
  $(".info--minT").prepend(data.main.temp_min);
}
function showPosition(position){
  $.ajax({
      url:  "https://fcc-weather-api.glitch.me/api/current?lat="
        + position.coords.latitude
        + "&lon=" + position.coords.longitude,
      method: "GET",
      dataType: "json",
      jsonp: false,
      cache: false,
      success: function(data){
        weatherData = data;
      }
    }
  );
}
function showWeather(data){
  $( ".city" ).append(data.name);
  $( "#currentWeatherIcon" ).addClass("wi-owm-" + data.weather[0].id);
  if(currentTempUnit === "c") {
    getCelsiusTemp(data);
    $(".info > p > i:not(:last)").addClass("wi-celsius");
  } else if(currentTempUnit === "f"){
    getFahrenheitTemp(data);
    $(".info > p > i:not(:last)").addClass("wi-fahrenheit");
  }
  $( ".info--wind" ).append(data.wind.speed);
}
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      $(".city").append("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      $(".city").append("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      $(".city").append("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      $(".city").append("An unknown error occurred.");
      break;
  }
}
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        $(".city").append("Geolocation is not supported by this browser.");
        $(".city").css("color", "Red");
    }
}

$(document).ready(function() {
  getLocation();
  $(".info > p > i:not(:last)").on("click", function(){
    if(currentTempUnit === "c"){
      currentTempUnit = "f";
      $(".info > p > i:not(:last)").removeClass("wi-celsius");
      $(".info > p > i:not(:last)").addClass("wi-fahrenheit");
    } else if (currentTempUnit === "f"){
      currentTempUnit = "c";
      $(".info > p > i:not(:last)").removeClass("wi-fahrenheit");
      $(".info > p > i:not(:last)").addClass("wi-celsius");
      //TODO: update data about temp
    }
  });
  });
$(document).ajaxComplete(function(){
  showWeather(weatherData);
});



