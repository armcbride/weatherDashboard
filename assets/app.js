
//global variables


//weather queryURL
var APIKey = "4b4fc905987791628273a594a06e68d7";
var baseURL = 'https://api.openweathermap.org/data/2.5/weather?';

var weatherIconBase = `http://openweathermap.org/img/wn/`;

var currentTime = moment().format('LLLL');
$('#currentDay').append(currentTime);

//UV queryl URL and Key
var uvKey= "4318c140f3e032da26d8b4e00dc97aab";
var uvIndex= 0;
var uvURL="https://api.openweathermap.org/data/2.5/uvi?appid=";

//five day forecast queryURL
var forecastKey = "327c22d7e329579cb0b1376b7c47c4a1";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?" ;

//local storage variables
var city = JSON.parse(localStorage.getItem("city")) || [];
var cityS = $("#search-term") || city[0];

//local storage function
function loadCities() {
  $("#search-history").empty();
  for (var i = 0; i < city.length; i++) {
    var list = $("<div class='row'>");
    var cityNewDiv = $("<button class= 'load'>");
    cityNewDiv.text(city[i]);
    cityNewDiv.appendTo(list);
    $("#search-history").append(list);
  }
}
loadCities();
//onclick, search
$(document).on("click", ".load", function () {
  
  var cityInput = $(this).text();
  handleSearch(cityInput);
});

//creates buttons from search input
$("#btn").on("click", function (e) {
  e.preventDefault();
  var cityInput = cityS.val().trim();

  if (cityInput) {
    var cityDiv = $("<div>");
    cityDiv.text(cityInput);
    if (city.indexOf(cityInput) === -1) {
      city.unshift(cityInput);
      localStorage.setItem("city", JSON.stringify(city));
    }
    handleSearch(cityInput);
    loadCities();
    cityS.val("");

  }
});


//assigns color to UV
function uvColor() {
  if (uvIndex >= 11.0) {
    $("#uv").css("color", "violet");
  } else if (uvIndex >= 8.0 && uvIndex < 11.0) {
    $("#uv").css("color", "red");
  } else if (uvIndex >= 6.0 && uvIndex < 8.0) {
    $("#uv").css("color", "orange");
  } else if (uvIndex >= 3.0 && uvIndex < 6.0) {
    $("#uv").css("color", "yellow");
  } else if (uvIndex < 3.0) {
    $("#uv").css("color", "lightblue");
  }
}
// search term function
function handleSearch(cityName) {
  
//call for weather of the day
  $.ajax({
    url: `${baseURL}q=${cityName}&appid=${APIKey}`,
    method: "GET"
  }).then(function (res) {
   
  $('#city-display').empty()
    var tempF= (res.main.temp - 273.15) * 1.8 + 32;
    var feelsTemp= (res.main.feels_like - 273.15) * 1.8 + 32;
    var infoBlock = `
    <div id='display-main' class= 'shadow-lg p-3 mb-5 rounded container col-8'>
      <span><h3>${res.name}</h3></span>
      <img src="${weatherIconBase}${res.weather[0].icon}@2x.png"
    </div>
    <div id='display-details'><h4>
    Temperature: ${tempF.toFixed(2)}<br>
    Feels like: ${feelsTemp.toFixed(2)}<br>
    Humidity: ${res.main.humidity}%<br>
    Wind Speed: ${res.wind.speed}mph <br>
    <div id= "uv"></div></h4></div>
    
  `
  //puts the weather block on the page
  $('#city-display').prepend(infoBlock)

//creates variables to place url for UV index
  var lat = res.coord.lat;
  var lon = res.coord.lon;
  //ajax call for UV
  $.ajax({
    url: `${uvURL}${uvKey}&lat=${lat}&lon=${lon}`,
    method: "GET"
  }).then(function(res) {
    //appends information to UV div created in above infoblock
    $("#uv")
      .text("UV" + " " + res.value)
      .addClass(uvColor());
})
//5 day forecast
    $.ajax({
      url: `${forecastURL}q=${cityName}&appid=${forecastKey}`,
      method: "GET"
    }).then(function (res) {
     
      var forecast5Days = $(` <div class="shadow-lg p-3 mb-5 rounded container card-group"></div>`);
  
    $("#forecast").empty();
      for (var i = 0; i < 5; i++) {
        var tempF = (res.list[i].main.temp - 273.15) * 1.8 + 32;
        var feelsF = (res.list[i].main.feels_like - 273.15) * 1.8 + 32;
        var maxF = (res.list[i].main.temp_max - 273.15) * 1.8 + 32;
        var minF = (res.list[i].main.temp_min - 273.15) * 1.8 + 32;
  
        var forecastCard = $(`<div class="row">
        <div class = "col-12">
        <img src="http://openweathermap.org/img/wn/${
          res.list[i].weather[0].icon
        }@2x.png" class="card-img-top" alt="icon of weather">
        <div class="card-body">
          <h5 class="card-title">${moment()
            .add(i + 1, "day")
            .format("dddd")}</h5>
          <div class="card-text">
          <div class="time"></div>
          Temperature: ${tempF.toFixed(2)}<br>
          Feels Like: ${feelsF.toFixed(2)}<br>
          Min: ${minF.toFixed(2)}<br>
          Max: ${maxF.toFixed(2)}<br>
          Humidity: ${res.list[i].main.humidity}%<br>
          </div>
        </div>
        </div>
        </div>`);
  
        forecast5Days.append(forecastCard);
        // closes for loop
      }
      $("#forecast").append(forecast5Days);

  
    });
  
  
})
}







