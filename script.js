const city = document.getElementById("city")
const temperature = document.getElementById("temperature")
const description = document.getElementById("description")
const sunrise = document.getElementById("sunrise")
const sunset = document.getElementById("sunset")
const forecastContainer = document.getElementById("forecast")

const styleWeatherApp = (weatherMain, weatherId, weatherIconName) => {
  const container = document.getElementById("weather-container")
  const outfitTip = document.getElementById("outfit-tip")
  const weatherIcon = document.getElementById("weather-icon")

  const isNight = weatherIconName.endsWith("n")

  let iconFile = "sol-och-moln.svg"

  // ========== CLEAR SUN & NIGHT ==========
  if (weatherMain === "Clear") {
    if (isNight) {
      container.style.backgroundColor = "#1a252f"
      outfitTip.innerHTML = "Stjärnklart och fint ikväll! 🌙"
      iconFile = "natt.svg"
    } else {
      container.style.backgroundColor = "#f7dc6f" //sunny yellow
      outfitTip.innerHTML = "Kläder efter väder: Solbrillor och T-shirt! ☀️"
      iconFile = "dag.svg"
    }
  }

  // ========== CLOUDY ==========
  else if (weatherMain === "Clouds") {
    if (weatherId === 801 || weatherId === 802) {
      if (isNight) {
        container.style.backgroundColor = "#2c3e50"
        outfitTip.innerHTML = "Lite nattmoln på himlen. 🌙☁️"
        iconFile = "natt-och-lite-moln.svg"
      } else {
        container.style.backgroundColor = "#d5d8dc"
        outfitTip.innerHTML = "Solen kikar fram mellan molnen ibland! 🌤️"
        iconFile = "sol-och-lite-moln.svg"
      }
    }
    else if (weatherId === 803) {
      if (isNight) {
        container.style.backgroundColor = "#212f3d"
        outfitTip.innerHTML = "Ganska molnigt ikväll. ☁️"
        iconFile = "natt-ganska-molnigt.svg"
      } else {
        container.style.backgroundColor = "#95a5a6"
        outfitTip.innerHTML = "Ganska tunga moln på himlen idag. ⛅"
        iconFile = "ganska-molnigt.svg"
      }
    }
    else if (weatherId === 804) {
      if (isNight) {
        container.style.backgroundColor = "#1c2833"
        outfitTip.innerHTML = "Helt mulet i natt. ☁️"
        iconFile = "natt-helmulet.svg"
      } else {
        container.style.backgroundColor = "#707b7c"
        outfitTip.innerHTML = "Grått och helmulet. Det hänger nästan regn i luften! ☁️"
        iconFile = "helmulet.svg"
      }
    }
  }

  // ========== RAIN ==========
  else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
    container.style.backgroundColor = "#34495e"

    if (weatherId === 500 && !isNight) {
      outfitTip.innerHTML = "Det duggar lite lätt medan solen är framme! 🌦️"
      iconFile = "solregn.svg"
    }
    else if (weatherId === 501 && !isNight) {
      outfitTip.innerHTML = "Regnskurar, men solen kämpar på i bakgrunden! 🌦️"
      iconFile = "medium-regn-sol.svg"
    }
    else if (weatherId === 500 || weatherMain === "Drizzle") {
      outfitTip.innerHTML = "Det duggar lite lätt, ett litet paraply räcker! 🌧️"
      iconFile = "latt-regn.svg"
    }
    else if (weatherId === 501) {
      outfitTip.innerHTML = "Klassiskt svenskt regn. Jacka på! 🌧️"
      iconFile = "medium-regn.svg"
    }
    else {
      outfitTip.innerHTML = "Ösregn! Regnjacka och gummistövlar på! 🌧️"
      iconFile = "hart-regn.svg"
    }
  }

  // ========== THUNDER & HAIL ==========
  else if (weatherMain === "Thunderstorm") {
    container.style.backgroundColor = "#2c3e50"
    outfitTip.innerHTML = "Mullret går! Håll dig inomhus och mys. ⛈️"
    iconFile = "aska.svg"
  }

  if (weatherId === 511) {
    container.style.backgroundColor = "#34495e"
    outfitTip.innerHTML = "Se upp, det haglar/är underkylt regn! 🥶"
    iconFile = "hagel.svg"
  }

  // ========== SNOW ==========
  else if (weatherMain === "Snow") {
    container.style.backgroundColor = "#EBF5FB"
    if (weatherId === 600 && !isNight) {
      outfitTip.innerHTML = "Lätt nysnö och solglimtar! ❄️☀️"
      iconFile = "latt-sno-sol.svg"
    }
    else if (weatherId === 601 && !isNight) {
      outfitTip.innerHTML = "Det snöar på flit, men solen syns bakom! ❄️"
      iconFile = "medium-sno-sol.svg"
    }
    else if (weatherId === 600) {
      outfitTip.innerHTML = "Det singlar ner lite mysig nysnö! ❄️"
      iconFile = "latt-sno.svg"
    }
    else if (weatherId === 601) {
      outfitTip.innerHTML = "Det snöar jämnt och fint ute. ❄️"
      iconFile = "medium-sno.svg"
    }
    else {
      outfitTip.innerHTML = "Snöstorm! Tjockjacka, mössa och vantar på! 🌨️"
      iconFile = "tung-sno.svg"
    }
  }

  weatherIcon.src = `./assets/${iconFile}`
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

      city.innerHTML = data.name
      temperature.innerHTML = `${data.main.temp.toFixed(1)}°`
      description.innerHTML = data.weather[0].description

      const weatherMain = data.weather[0].main
      const weatherId = data.weather[0].id
      const weatherIconName = data.weather[0].icon

      const sunriseTime = formatTime(data.sys.sunrise)
      const sunsetTime = formatTime(data.sys.sunset)

      sunrise.innerHTML = sunriseTime
      sunset.innerHTML = sunsetTime

      styleWeatherApp(weatherMain, weatherId, weatherIconName)
    })
    .catch((error) => console.error("Oops, your weather fetch did not work:", error))
}

fetchWeather()

const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&lang=se&APPID=${API_KEY}`

const fetchForecast = () => {
  fetch(FORECAST_URL)
    .then((response) => response.json())
    .then((data) => {
      const filteredForecast = data.list.filter((item) => item.dt_txt.includes("12:00:00")
      )

      forecastContainer.innerHTML = ""

      filteredForecast.forEach((day) => {

        const date = new Date(day.dt_txt)

        const dayName = date.toLocaleDateString("sv-SE", { weekday: "short" })

        const temp = day.main.temp.toFixed(1)

        forecastContainer.innerHTML += `
        <div class="forecast-row">
        <span class="forecast-day">${dayName}</span>
        <span class="forecast-temp">${temp}</span>
        </div>
        `
      })


    })
    .catch((error) => console.error("Prognos-fetch not working:", error))
}

fetchForecast()