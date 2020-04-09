
//global variables

//variable to place the user input into queryURL
var city = $('#search-term');
//weather queryURL
var APIKey = "4b4fc905987791628273a594a06e68d7";
var baseURL = 'https://api.openweathermap.org/data/2.5/weather?';

var weatherIconBase = `http://openweathermap.org/img/wn/`;

var currentTime = moment().format('LLLL');
$('#currentDay').append(currentTime);
console.log(currentTime);

//UV queryl URL and Key
var uvKey= "4318c140f3e032da26d8b4e00dc97aab";
var uvIndex= 0;
var uvURL="https://api.openweathermap.org/data/2.5/uvi?appid=";

//five day forecast queryURL
var forecastKey = "327c22d7e329579cb0b1376b7c47c4a1";
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?" ;

//Local storage variable
var cityHistory = JSON.parse(window.localStorage.getItem("cityHistory")) || [];

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
function handleSearch(e) {
  e.preventDefault();
  

//call for weather of the day
  $.ajax({
    url: `${baseURL}q=${city.val()}&appid=${APIKey}`,
    method: "GET"
  }).then(function (res) {
    // saveCity()
    // console.log(res);
    if (cityHistory.indexOf(city.val()) === -1){
          cityHistory.push(city.val());
          window.localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
          createButtons(city.val());
        }

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
      url: `${forecastURL}q=${city.val()}&appid=${forecastKey}`,
      method: "GET"
    }).then(function (res) {
     
      console.log(res);
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
          <h5 class="card-title">${res.city.name}</h5>
          <div class= "card-text>
          <p class="time">${moment()
            .add(i + 1, "day")
            .format("dddd")}</p>
          <p>Temperature: ${tempF.toFixed(2)}</p>
          <p>Feels Like: ${feelsF.toFixed(2)}</p>
          <p>Min: ${minF.toFixed(2)} </p>
          <p>Max: ${maxF.toFixed(2)}</p>
          <p>Humidity: ${res.list[i].main.humidity}</p>
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


function createButtons (text){
var div = $('<button>').text(text);
$('#search-history').prepend(div);

}

function loadCities(e) {

  $("#search-history").empty();
  for (var i = 0; i < cityHistory.length; i++) {
    var list = $("<div>");
    var cityNewDiv = $("<button class='load'>");
    cityNewDiv.text(cityHistory[i]);
    cityNewDiv.appendTo(list);
    $("#search-history").append(list);

    $('#search-history').on('click','div', function(){
      handleSearch(city.val())
    
    })
  }
}
loadCities();


$('#search-form').submit(handleSearch)
