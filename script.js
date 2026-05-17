const city = document.getElementById("city")
const temperature = document.getElementById("temperature")
const description = document.getElementById("description")
const sunrise = document.getElementById("sunrise")
const sunset = document.getElementById("sunset")

const styleWeatherApp = (weatherMain) => {
  const container = document.getElementById("weather-container")
  const outfitTip = document.getElementById("outfit-tip")

  // Function that styles app based on weather-id & Outfit tip (kläder efter väder)
  if (weatherMain === "Clear") {
    container.style.backgroundColor = "#F7DC6F" //sunny yellow
    outfitTip.innerHTML = "Kläder efter väder: Solbrillor och T-shirt! ☀️"
  } else if (weatherMain === "Clouds") {
    container.style.backgroundColor = "#AEB6BF" //cloudy grey 
    outfitTip.innerHTML = "Kläder efter väder: En skön tröja räcker nog. ☁️"
  } else if (weatherMain === "Thunderstorm") {
    container.style.backgroundColor = "#2C3E50" //thunder grey
    outfitTip.innerHTML = "Kläder efter väder: Håll dig inomhus i myskläder! ⛈️"
  } else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
    container.style.backgroundColor = "#34495E" //rain grey
    outfitTip.innerHTML = "Kläder efter väder: Regnjacka och gummistövlar på! 🌧️"
  } else if (weatherMain === "Snow") {
    container.style.backgroundColor = "#EBF5FB" //snow white
    outfitTip.innerHTML = "Kläder efter väder: Tjockjacka, mössa och vantar! ❄️"
  }
}

const formatTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000)

  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${hours}:${minutes}`
}

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

      const weatherMain = data.weather[0].main

      const sunriseTime = formatTime(data.sys.sunrise)
      const sunsetTime = formatTime(data.sys.sunset)

      sunrise.innerHTML = sunriseTime
      sunset.innerHTML = sunsetTime

      styleWeatherApp(weatherMain)
    })
    .catch((error) => console.error("Oops, your weather fetch did not work:", error))
}

fetchWeather()

