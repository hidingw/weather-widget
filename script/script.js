/**
 * Created by hidin on 7/28/2017.
 */
"use strict";

var weatherData;
var weather5Days;
var currentTempUnit = "c";
var currentTime;

function getDate(dateUNIX){
  var a = new Date(dateUNIX * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var day = a.getDate();
  currentTime = a.getHours();
  // var min = a.getMinutes();
  // var time = hour + ':' + min ;
  return day + " " + month + " " + year;
}
function setBackground(hours) {
  if(parseInt(hours) > 20){
    $( document.body ).css( "background-image",'url("http://oopstyle.net/wp-content/uploads/2017/06/City-Background-Night-Street-RO.jpg")' );
  } else if(hours <= 20){
    $( document.body ).css( "background-image", 'url("http://zellox.com/wp-content/uploads/2016/05/website-backgrounds-%E2%80%AB1%E2%80%AC-%E2%80%AB%E2%80%AC.jpg")' );
  }
}
function getFahrenheitTemp(data) {
  $(".info--currentT > span").empty().prepend((data.main.temp * 1.8) + 32);
}
function getCelsiusTemp(data) {
  $(".info--currentT > span").empty().prepend(data.main.temp);
}
function getWeather(position){
  $.ajax({
      url:  "http://api.openweathermap.org/data/2.5/weather?lat="
        + position.coords.latitude
        + "&lon=" + position.coords.longitude
        + "&APPID=f3802e3a51821907ffe2a930031d46f0&units=metric",
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
  $( ".city" ).empty().append(data.name);
  $(".current-weather > span").empty().prepend("Now: " + data.weather[0].description)
  $( ".current-weather > i" ).addClass("wi-owm-" + data.weather[0].id);
  if(currentTempUnit === "c") {
    getCelsiusTemp(data);
    $(".info > p > i:not(:last)").addClass("wi-celsius");
  } else if(currentTempUnit === "f"){
    getFahrenheitTemp(data);
    $(".info > p > i:not(:last)").addClass("wi-fahrenheit");
  }
  $( ".info--wind > span" ).empty().append(data.wind.speed);
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
        navigator.geolocation.getCurrentPosition(getWeather, showError);
    } else {
        $(".city").append("Geolocation is not supported by this browser.").css("color", "Red");
    }
}
function get5DaysWeather() {
  navigator.geolocation.getCurrentPosition(function (position) {
  $.ajax({
      url:  "http://api.openweathermap.org/data/2.5/forecast?lat="
      + position.coords.latitude
      + "&lon=" + position.coords.longitude
      + "&APPID=f3802e3a51821907ffe2a930031d46f0&units=metric",
      method: "GET",
      dataType: "json",
      jsonp: false,
      cache: false,
      success: function(data){
        weather5Days = data;
      }
    })
  });
}
function show5DaysWeather(data) {
  $(".weather-info").empty();
  for(var i = 0; i < data.cnt - 1; i++){
    
  }
}


$(document).ready(function() {
  getLocation();
  get5DaysWeather();
});
$(document).ajaxComplete(function(){
  $(".date").empty().append("<p>" + getDate(weatherData.dt) + "</p>");
  showWeather(weatherData);
  setBackground(currentTime);
});
$(".info > p > i:not(:last)").on("click", function(){
  if(currentTempUnit === "c"){
    currentTempUnit = "f";
    $(".info > p > i:not(:last)").removeClass("wi-celsius").addClass("wi-fahrenheit");
    $(".info > p:not(:last) > span").empty();
    $(".info > p:not(:last) > span").textContent = getFahrenheitTemp(weatherData);
  } else if (currentTempUnit === "f"){
    currentTempUnit = "c";
    $(".info > p > i:not(:last)").removeClass("wi-fahrenheit").addClass("wi-celsius");
    $(".info > p:not(:last) > span").empty();
    $(".info > p:not(:last) > span").textContent = getCelsiusTemp(weatherData);
  }
});
$("#getFiveDayWeather").on("click", function () {
  show5DaysWeather(weather5Days);
});



