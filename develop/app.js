
//global variables
var APIKey = "4b4fc905987791628273a594a06e68d7";
var baseURL = 'https://api.openweathermap.org/data/2.5/weather?';

var weatherIconBase = `http://openweathermap.org/img/wn/`;

var currentTime = moment().format('L');
console.log(currentTime);

// var cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

// search term function
function handleSearch(e) {
  e.preventDefault()
  var city = $('#search-term').val();
  $.ajax({
    url: `${baseURL}q=${city}&appid=${APIKey}`,
    method: "GET"
  }).then(function (res) {
    displayInfo(res)
    saveCity(res.name)
    console.log(res);
   
  })
  
}
//writing city information to page
function displayInfo(res) {
var tempF= (res.main.temp - 273.15) * 1.8 + 32;
var feelsTemp= (res.main.feels_like - 273.15) * 1.8 + 32;
  var infoBlock = `
    <div id='display-main' class= 'shadow-lg p-3 mb-5 rounded container col-8'>
      <span><h3>${res.name}</h3></span>
      <img src="${weatherIconBase}${res.weather[0].icon}@2x.png"
    </div>
    <div id='display-details'><h4>Temperature: ${tempF.toFixed(2)}<br>
Feels like: ${feelsTemp.toFixed(2)}<br>
    Humidity: ${res.main.humidity}%<br>
    Wind Speed: ${res.wind.speed}mph <br></h4></div>
    <div id='display-forecast'>
    </div>
  `
  $('#city-display').prepend(infoBlock)
}

//local storage function
function saveCity(name) {

}

$('#search-form').submit(handleSearch)