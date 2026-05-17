const city = document.getElementById("city")
const temperature = document.getElementById("temperature")
const description = document.getElementById("description")
const sunrise = document.getElementById("sunrise")
const sunset = document.getElementById("sunset")
const forecastContainer = document.getElementById("forecast")
const wind = document.getElementById("wind")
const humidity = document.getElementById("humidity")
const feelsLike = document.getElementById("feels-like")
const uvIndex = document.getElementById("uv-index")
const uvWarning = document.getElementById("uv-warning")

const styleWeatherApp = (weatherMain, weatherId, weatherIconName) => {
  const container = document.getElementById("weather-container")
  const outfitTip = document.getElementById("outfit-tip")
  const weatherIcon = document.getElementById("weather-icon")

  const isNight = weatherIconName.endsWith("n")

  let iconFile = "sol-och-moln.svg"

  // ========== CLEAR SUN & NIGHT ==========
  if (weatherMain === "Clear") {
    if (isNight) {
      document.body.style.backgroundColor = "#1a252f"
      outfitTip.innerHTML = "Stjärnklart och fint ikväll! 🌙"
      iconFile = "natt.svg"
    } else {
      document.body.style.backgroundColor = "#f7dc6f" //sunny yellow
      outfitTip.innerHTML = "Kläder efter väder: Solbrillor och T-shirt! ☀️"
      iconFile = "dag.svg"
    }
  }

  // ========== CLOUDY ==========
  else if (weatherMain === "Clouds") {
    if (weatherId === 801 || weatherId === 802) {
      if (isNight) {
        document.body.style.backgroundColor = "#2c3e50"
        outfitTip.innerHTML = "Lite nattmoln på himlen. 🌙☁️"
        iconFile = "natt-och-lite-moln.svg"
      } else {
        document.body.style.backgroundColor = "#d5d8dc"
        outfitTip.innerHTML = "Solen kikar fram mellan molnen ibland! 🌤️"
        iconFile = "sol-och-lite-moln.svg"
      }
    }
    else if (weatherId === 803) {
      if (isNight) {
        document.body.style.backgroundColor = "#212f3d"
        outfitTip.innerHTML = "Ganska molnigt ikväll. ☁️"
        iconFile = "natt-ganska-molnigt.svg"
      } else {
        document.body.style.backgroundColor = "#95a5a6"
        outfitTip.innerHTML = "Ganska tunga moln på himlen idag. ⛅"
        iconFile = "ganska-molnigt.svg"
      }
    }
    else if (weatherId === 804) {
      if (isNight) {
        document.body.style.backgroundColor = "#1c2833"
        outfitTip.innerHTML = "Helt mulet i natt. ☁️"
        iconFile = "natt-helmulet.svg"
      } else {
        document.body.style.backgroundColor = "#707b7c"
        outfitTip.innerHTML = "Grått och helmulet. Det hänger nästan regn i luften! ☁️"
        iconFile = "helmulet.svg"
      }
    }
  }

  // ========== RAIN ==========
  else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
    document.body.style.backgroundColor = "#34495e"

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
    document.body.style.backgroundColor = "#2c3e50"
    outfitTip.innerHTML = "Mullret går! Håll dig inomhus och mys. ⛈️"
    iconFile = "aska.svg"
  }

  if (weatherId === 511) {
    document.body.style.backgroundColor = "#34495e"
    outfitTip.innerHTML = "Se upp, det haglar/är underkylt regn! 🥶"
    iconFile = "hagel.svg"
  }

  // ========== SNOW ==========
  else if (weatherMain === "Snow") {
    document.body.style.backgroundColor = "#EBF5FB"
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

const fetchWeather = (cityName) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=se&APPID=${API_KEY}`

  fetch(URL)
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

      wind.innerHTML = `${data.wind.speed.toFixed(1)} m/s`
      humidity.innerHTML = `${data.main.humidity}%`
      feelsLike.innerHTML = `${data.main.feels_like.toFixed(1)}°`

      const currentTemp = data.main.temp
      const isSunny = data.weather[0].main === "Clear"
      const isNightTime = data.weather[0].icon.endsWith("n")

      let calculatedUV = 0

      if (isNightTime) {
        calculatedUV = 0
      } else if (isSunny) {
        // If sunny, gives higher UV the hotter temp
        calculatedUV = Math.min(11, Math.max(1, Math.round(currentTemp / 3)))
      } else {
        // if cloudy, less UV 
        calculatedUV = Math.min(3, Math.max(0, Math.round(currentTemp / 6)))
      }

      uvIndex.innerHTML = calculatedUV

      if (calculatedUV >= 3) {
        uvWarning.style.display = "block"
        if (calculatedUV >= 6) {
          uvWarning.innerHTML = "⚠️ Hög UV-strålning! Smörj in dig med SPF 30+ sök skugga mitt på dagen! 🧴☀️"
          uvWarning.style.backgroundColor = "#f1948a"
        } else {
          uvWarning.innerHTML = "🧴 Solskyddsfaktor rekommenderas om du ska vara ute länge idag! ☀️"
          uvWarning.style.backgroundColor = "#f9e79f"
        }
      } else {
        uvWarning.style.display = "none"  // hide bubble if low UV 
      }

      styleWeatherApp(weatherMain, weatherId, weatherIconName)

      // styleWeatherApp("Clear", 800, "01d")
    })
    .catch((error) => console.error("Oops, your weather fetch did not work:", error))
}

const getCustomIcon = (iconCode) => {
  const isNight = iconCode.endsWith("n")

  if (iconCode.startsWith("01")) return isNight ? "natt.svg" : "dag.svg"
  if (iconCode.startsWith("02")) return isNight ? "natt-och-lite-moln.svg" : "sol-och-lite-moln.svg"
  if (iconCode.startsWith("03") || iconCode.startsWith("04")) {
    return isNight ? "natt-helmulet.svg" : "helmulet.svg"
  }
  if (iconCode.startsWith("09") || iconCode.startsWith("10")) {
    return isNight ? "medium-regn.svg" : "solregn.svg"
  }
  if (iconCode.startsWith("11")) return "aska.svg"
  if (iconCode.startsWith("13")) return isNight ? "latt-sno.svg" : "latt-sno-sol.svg"

  return "sol-och-moln.svg"
}

const fetchForecast = (cityName) => {
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&lang=se&APPID=${API_KEY}`
  fetch(FORECAST_URL)
    .then((response) => response.json())
    .then((data) => {
      const filteredForecast = data.list.filter((item) => item.dt_txt.includes("12:00:00"))
      forecastContainer.innerHTML = ""

      filteredForecast.forEach((day) => {
        const date = new Date(day.dt_txt)
        const dayName = date.toLocaleDateString("sv-SE", { weekday: "short" })
        const temp = day.main.temp.toFixed(1)
        const forecastIcon = day.weather[0].icon

        const customIconFile = getCustomIcon(forecastIcon)

        forecastContainer.innerHTML += `
        <div class="forecast-row">
        <span class="forecast-day">${dayName}</span>
        <img src="./assets/${customIconFile}" class="forecast-icon-small" /> 
        <span class="forecast-temp">${temp}°</span>
        </div>
        `
      })
    })
    .catch((error) => console.error("Prognos-fetch not working:", error))
}

const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")

searchBtn.addEventListener("click", () => {
  const userSearch = searchInput.value

  if (userSearch) {
    fetchWeather(userSearch)
    fetchForecast(userSearch)
    searchInput.value = ""
  }
})

fetchWeather("Tierp")
fetchForecast("Tierp")