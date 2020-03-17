var APIKey= "4b4fc905987791628273a594a06e68d7";
var queryURL = 'https://api.openweathermap.org/data/2.5/weather?' + APIKey;

$.ajax({
    url: queryURL,
    method: "GET"
})