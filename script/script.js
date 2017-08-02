/**
 * Created by hidin on 7/28/2017.
 */
"use strict";

var currentTempUnit = "c";
var currentTempF = 0;
var currentTempC = 0;
var currentTime = 0;
var weather5days;
var offset = 0;

function checkOffset() {
  if(offset === 0){
    $(".nav-btn > .fa-chevron-left").css("display", "none");
  } else if(offset >= (weather5days.cnt - 5)){
    $(".nav-btn > .fa-chevron-right").css("display", "none");
  } else {
    $(".nav-btn > .fa-chevron-left").css("display", "block");
    $(".nav-btn > .fa-chevron-right").css("display", "block");
  }
}
function clear5daysFields() {
  for(var i = 0; i < 5; i++ ){
    $(".block-" + i + "> .date > span").empty();
    $(".block-" + i + "> .time > span").empty();
    $(".block-" + i + "> .weather > span").empty();
    $(".block-" + i + "> .weather > i").empty();
    $(".block-" + i + "> .temp > span").empty();
    $(".block-" + i + "> .temp > i").removeClass("wi-celsius");
    $(".block-" + i + "> .wind > span").empty();
  }
}
function getDate(dt){
  var a = new Date(dt * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var day = a.getDate();
  currentTime = a.getHours();
  return day + " " + month + " " + year;
}
function setBackground(hours) {
  if(parseInt(hours) > 20){
    $( document.body ).css( "background-image",'url("http://oopstyle.net/wp-content/uploads/2017/06/City-Background-Night-Street-RO.jpg")' );
  } else if(hours <= 20){
    $( document.body ).css( "background-image", 'url("http://zellox.com/wp-content/uploads/2016/05/website-backgrounds-%E2%80%AB1%E2%80%AC-%E2%80%AB%E2%80%AC.jpg")' );
  }
}
function getFahrenheitTemp(temp) {
  currentTempF = parseInt((temp * 1.8) + 32);
}
function getCelsiusTemp(temp) {
  currentTempC = parseInt(temp);
}
function setWeather(data){
  $( ".city" ).empty().append(data.name);
  $(".current-date").empty().append("<p>" + getDate(data.dt) + "</p>");
  $( ".current-weather > span" ).empty().prepend("Now: " + data.weather[0].description);
  $( ".current-weather > i" ).addClass("wi-owm-" + data.weather[0].id);
  if(currentTempUnit === "c") {
    $(".info > p:not(:last) > span").append(currentTempC);
    $(".info > p > i:not(:last)").addClass("wi-celsius");
  } else if(currentTempUnit === "f"){
    getFahrenheitTemp(data);
    $(".info > p > i:not(:last)").addClass("wi-fahrenheit");
  }
  $( ".info--wind > span" ).empty().append(data.wind.speed);
}
function set5daysWeather(data) {
  checkOffset();
  for(var i = 0 + offset; i < 5 + offset; i++ ){
    $(".block-" + (i - offset) + "> .date > span").append(data.list[i].dt_txt.slice(0, -9));
    $(".block-" + (i - offset) + "> .time > span").append(data.list[i].dt_txt.slice(10, -3));
    $(".block-" + (i - offset) + "> .weather > span").append(data.list[i].weather[0].description);
    $(".block-" + (i - offset) + "> .weather > i").addClass("wi-owm-" + data.list[i].weather[0].id);
    $(".block-" + (i - offset) + "> .temp > span").append(parseInt(data.list[i].main.temp));
    $(".block-" + (i - offset) + "> .temp > i").addClass("wi-celsius");
    $(".block-" + (i - offset) + "> .wind > span").append(data.list[i].wind.speed);
  }
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
function show5DaysWeather() {
  checkOffset();
  $(".weather-main").fadeOut(function() {
    $(".weather-5days-info").fadeIn().css("display", "flex");
    $("#getCurrentWeather").fadeIn();
  });
  $("#getFiveDayWeather").fadeOut();
}
function showCurrentWeather() {
  $(".weather-5days-info").fadeOut(function() {
    $(".weather-main").fadeIn();
    $("#getFiveDayWeather").fadeIn();
  });
  $("#getCurrentWeather").fadeOut();
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
        getCelsiusTemp(data.main.temp);
        getFahrenheitTemp(data.main.temp);
        setWeather(data);
      }
    }
  );
}
function get5DaysWeather(position) {
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
      weather5days = data;
      set5daysWeather(data);
    }
  });
}
function getLocation(func) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(func, showError, {timeout:8000});
  } else {
    $(".city").append("Geolocation is not supported by this browser.").css("color", "Red");
  }
}

$(document).ready(function() {
  getLocation(getWeather);
  getLocation(get5DaysWeather);
  setBackground(currentTime);
  $("#temp").on("click", function(){
    if(currentTempUnit === "c"){
      currentTempUnit = "f";
      $(".info > p > i:not(:last)").removeClass("wi-celsius").addClass("wi-fahrenheit");
      $(".info > p:not(:last) > span").empty();
      $(".info > p:not(:last) > span").append(currentTempF);
    } else if (currentTempUnit === "f"){
      currentTempUnit = "c";
      $(".info > p > i:not(:last)").removeClass("wi-fahrenheit").addClass("wi-celsius");
      $(".info > p:not(:last) > span").empty();
      $(".info > p:not(:last) > span").append(currentTempC);
    }
  });
  $("#getFiveDayWeather").on("click", show5DaysWeather);
  $("#getCurrentWeather").on("click", showCurrentWeather);
  $(".three-hours-weather > .temp > i").on("click", function() {
    if(currentTempUnit === "c"){
      currentTempUnit = "f";
      $(".three-hours-weather > .temp > i").removeClass("wi-celsius").addClass("wi-fahrenheit");
      for(var i = 0; i < 5; i++){
        var c =  $(".block-" + i +" > .temp > span").text();
        $(".block-" + i +" > .temp > span").empty();
        $(".block-" + i +" > .temp > span").append(parseInt((parseInt(c) * 1.8) + 32));
      }
    } else if (currentTempUnit === "f"){
      currentTempUnit = "c";
      $(".three-hours-weather > .temp > i").removeClass("wi-fahrenheit").addClass("wi-celsius");
      for(var i = 0; i < 5; i++){
        var c =  $(".block-" + i +" > .temp > span").text();
        $(".block-" + i +" > .temp > span").empty();
        $(".block-" + i +" > .temp > span").append(parseInt((parseInt(c) -32 ) * 0.56));
      }
    }
  });
  $(".nav-btn > .fa-chevron-left").on("click", function() {
    if(offset < 5 || offset === 0){
      alert("No weather for this time");
    } else {
      offset -= 5;
      $(".weather-5days-info").fadeOut(function() {
        clear5daysFields();
        set5daysWeather(weather5days);
        $(".weather-5days-info").fadeIn();
    });
    }
  });
  $(".nav-btn > .fa-chevron-right").on("click", function() {
    if(offset >= (weather5days.cnt - 5)){
      offset = weather5days.cnt - 5;
      $(".weather-5days-info").fadeOut(function() {
        clear5daysFields();
        set5daysWeather(weather5days);
        $(".weather-5days-info").fadeIn();
      });
    } else {
      offset += 5;
      $(".weather-5days-info").fadeOut(function() {
        clear5daysFields();
        set5daysWeather(weather5days);
        $(".weather-5days-info").fadeIn();
      });
    }
  });
});