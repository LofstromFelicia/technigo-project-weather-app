const city = document.getElementById("city")
const temperature = document.getElementById("temperature")
const description = document.getElementById("description")

const API_KEY = "b41cc812b4058189c1534f5dd668317d"
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&lang=se&APPID=${API_KEY}`

const fetchWeather = () => {
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((data) => {
      console.log("Weatherdata:", data)

      city.innerHTML = data.name

      temperature.innerHTML = `${data.main.temp.toFixed(1)}°`

      description.innerHTML = data.weather[0].description
    })
    .catch((error) => console.error("Oops, your weather fetch did not work:", error))
}

fetchWeather()