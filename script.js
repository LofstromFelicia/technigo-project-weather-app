// --- DOM ELEMENTS --- 
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
const tempMaxMin = document.getElementById("temp-max-min")
const pop = document.getElementById("pop")
const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")

// --- FUNCTION: MATCHES ICONCODE TO SVG FILE ---
const getCustomIcon = (iconCode, weatherId = 0) => {
  const isNight = iconCode.endsWith("n")

  if (weatherId === 511) return "hagel.svg"
  if (iconCode.startsWith("01")) return isNight ? "natt.svg" : "dag.svg"
  if (iconCode.startsWith("02")) return isNight ? "natt-och-lite-moln.svg" : "sol-och-lite-moln.svg"
  if (iconCode.startsWith("03")) return isNight ? "natt-ganska-molnigt.svg" : "ganska-molnigt.svg"
  if (iconCode.startsWith("04")) return isNight ? "natt-helmulet.svg" : "helmulet.svg"
  if (iconCode.startsWith("09")) return "latt-regn.svg"
  if (iconCode.startsWith("10")) return "medium-regn.svg"
  if (iconCode.startsWith("11")) return "aska.svg"
  if (iconCode.startsWith("13")) return isNight ? "latt-sno.svg" : "latt-sno-sol.svg"

  return "sol-och-moln.svg"
}

// --- STYLING & CLOTHING TIPS ---
const styleWeatherApp = (weatherMain, weatherId, weatherIconName, currentTemp) => {
  const outfitTip = document.getElementById("outfit-tip")
  const weatherIcon = document.getElementById("weather-icon")
  const isNight = weatherIconName.endsWith("n")

  document.body.className = ""

  let iconFile = getCustomIcon(weatherIconName, weatherId)

  // === CLEAR SUN & NIGHT === 
  if (weatherMain === "Clear") {
    if (isNight) {
      document.body.classList.add("weather-rainy")
      outfitTip.innerHTML = "Stjärnklart och fint ikväll! 🌙"
    } else {
      document.body.classList.add("weather-sunny")
      if (currentTemp < 10) {
        outfitTip.innerHTML = "Soligt men lurigt! På med tjocktröja och solbrillorna.🥶🕶️"
      } else if (currentTemp >= 10 && currentTemp < 17) {
        outfitTip.innerHTML = "Solen skiner, men det är friskt. En skön tröja eller vårjacka blir perfekt! 🧥🕶️"
      } else {
        outfitTip.innerHTML = "Äntligen T-shirt och solbrillor! Ut och njut! ☀️🕶️"
      }
    }
  }

  // === CLOUDY ===
  else if (weatherMain === "Clouds") {
    document.body.classList.add("weather-cloudy")
    if (weatherId === 801 || weatherId === 802) {
      outfitTip.innerHTML = isNight ? "Lite nattmoln på himlen. 🌙☁️" : "Solen kikar fram ibland! Perfekt hoodie-väder. 🌤️"
    } else if (weatherId === 803) {
      outfitTip.innerHTML = isNight ? "Ganska molnigt ikväll. ☁️" : "Gråmulet men stabilt. En vindtät jacka sitter fint idag. ⛅"
    } else if (weatherId === 804) {
      outfitTip.innerHTML = isNight ? "Helt mulet i natt. ☁️" : "Helt mulet. Det hänger nästan regn i luften, men säkra upp med en keps eller luva! ☁️"
    }
  }

  // === RAIN & DRIZZLE ===
  else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
    document.body.classList.add("weather-rainy")

    if (iconFile === "solregn.svg") {
      outfitTip.innerHTML = "Det duggar medan solen är framme! Spana efter regnbågen. 🌦️🌈"
    } else if (iconFile === "latt-regn.svg") {
      outfitTip.innerHTML = "Småruggigt duggregn. Ett litet paraply eller en snygg keps räcker! 🌧️"
    } else if (weatherId === 501) {
      outfitTip.innerHTML = "Klassiskt svenskt regn. Jacka på och raska steg! 🌧️"
      iconFile = "medium-regn.svg"
    } else if (weatherId === 511) {
      outfitTip.innerHTML = "Se upp, det haglar/är underkylt regn! 🌧️"
    } else {
      outfitTip.innerHTML = "Himmelens portar är öppna! Regnjacka, gummistövlar och humöret på topp! 🌧️👢"
    }
  }

  // === THUNDER ===
  else if (weatherMain === "Thunderstorm") {
    document.body.classList.add("weather-rainy")
    outfitTip.innerHTML = "Mullret går! Håll dig inomhus och mys. ⛈️☕"
  }

  // === SNOW ===
  else if (weatherMain === "Snow") {
    document.body.classList.add("weather-snow")
    if (weatherId === 600) {
      outfitTip.innerHTML = isNight ? "Det singlar ner lite mysig nysnö! Fram med kameran. ❄️" : "Lätt nysnö och solglimtar ❄️☀️"
    } else if (weatherId === 601) {
      outfitTip.innerHTML = isNight ? "Det snöar jämnt och fint ute. ❄️" : "Det snöar, men solen syns bakom! ❄️☀️"
    } else {
      outfitTip.innerHTML = "Snöstorm! Tjockjacka, mössa och vantar på! Eller stanna inne vid brasan! 🌨️🔥"
    }
  }

  weatherIcon.src = `./assets/${iconFile}`
}

// --- FUNCTION: FORMAT TIMESTAMP TO HH:MM --- 
const formatTime = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  return `${hours}:${minutes}`
}

// --- API CONFIG --- 
const API_KEY = "b41cc812b4058189c1534f5dd668317d"

// --- FETCH CURRENT WEATHER --- 
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

      sunrise.innerHTML = formatTime(data.sys.sunrise)
      sunset.innerHTML = formatTime(data.sys.sunset)

      wind.innerHTML = `${data.wind.speed.toFixed(1)} m/s`
      humidity.innerHTML = `${data.main.humidity}%`
      feelsLike.innerHTML = `${data.main.feels_like.toFixed(1)}°`

      // Logical fallback for precipitation probability 
      let rainChance = data.clouds.all
      if (["Rain", "Drizzle", "Thunderstorm"].includes(weatherMain)) {
        rainChance = 100
      } else if (weatherMain === "Clear") {
        rainChance = 0
      } else {
        rainChance = Math.round(data.clouds.all * 0.4)
      }
      pop.innerHTML = `${rainChance}%`

      const currentTemp = data.main.temp
      const isSunny = data.weather[0].main === "Clear"
      const isNightTime = data.weather[0].icon.endsWith("n")

      // Dynamic calculation for UV-index
      let calculatedUV = 0
      if (isNightTime) {
        calculatedUV = 0
      } else if (isSunny) {
        calculatedUV = Math.min(11, Math.max(1, Math.round(currentTemp / 3)))
      } else {
        calculatedUV = Math.min(3, Math.max(0, Math.round(currentTemp / 6)))
      }
      uvIndex.innerHTML = calculatedUV

      // UV warning container 
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
        uvWarning.style.display = "none"
      }

      styleWeatherApp(weatherMain, weatherId, weatherIconName, currentTemp)
    })
    .catch((error) => console.error("Oops, your weather fetch did not work:", error))
}

// --- 5-DAY / HOURLY FORECAST --- 
const fetchForecast = (cityName) => {
  const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&lang=se&APPID=${API_KEY}`
  fetch(FORECAST_URL)
    .then((response) => response.json())
    .then((data) => {
      // NEW : 3 / 6 hours prognos
      const hour1Data = data.list[0]
      const hour2Data = data.list[1]

      if (hour1Data && hour2Data) {
        const temp1 = Math.round(hour1Data.main.temp)
        const temp2 = Math.round(hour2Data.main.temp)

        const icon1File = getCustomIcon(hour1Data.weather[0].icon)
        const icon2File = getCustomIcon(hour2Data.weather[0].icon)

        const date1 = new Date(hour1Data.dt * 1000)
        const date2 = new Date(hour2Data.dt * 1000)

        const time1 = date1.getHours().toString().padStart(2, "0") + ":00"
        const time2 = date2.getHours().toString().padStart(2, "0") + ":00"

        const hourlyForecastContainer = document.getElementById('hourly-forecast')
        if (hourlyForecastContainer) {
          hourlyForecastContainer.innerHTML = `
          <div class="hour-item">
          <span class="hour-time">${time1}</span>
          <img class="hour-icon" src="./assets/${icon1File}" alt="Weather Icon">
          <span class="hour-temp">${temp1}°C</span>
          </div>
          <div class="hour-item">
          <span class="hour-time">${time2}</span>
          <img class="hour-icon" src="./assets/${icon2File}" alt="Weather Icon">
          <span class="hour-temp">${temp2}°C</span>
          </div>
          `
        }
      }

      const next24Hours = data.list.slice(0, 8)
      let highestTemp = -100
      let lowestTemp = 100

      next24Hours.forEach((item) => {
        if (item.main.temp_max > highestTemp) {
          highestTemp = item.main.temp_max
        }
        if (item.main.temp_min < lowestTemp) {
          lowestTemp = item.main.temp_min
        }
      })

      tempMaxMin.innerHTML = `${highestTemp.toFixed(1)}° / ${lowestTemp.toFixed(1)}°`

      const filteredForecast = data.list.filter((item) => item.dt_txt.includes("12:00:00"))
      forecastContainer.innerHTML = ""

      filteredForecast.forEach((day) => {
        const date = new Date(day.dt_txt)
        const dayNameLong = date.toLocaleDateString("sv-SE", { weekday: "long" })
        const dayNameFormatted = dayNameLong.charAt(0).toUpperCase() + dayNameLong.slice(1)

        const shortPart = dayNameFormatted.slice(0, 3)
        const restPart = dayNameFormatted.slice(3)

        const temp = day.main.temp.toFixed(1)
        const customIconFile = getCustomIcon(day.weather[0].icon, day.weather[0].id)

        forecastContainer.innerHTML += `
        <div class="forecast-row">
        <span class="forecast-day">
        ${shortPart}<span class="hide-rest">${restPart}</span>
        </span>
        <img src="./assets/${customIconFile}" class="forecast-icon-small" /> 
        <span class="forecast-temp">${temp}°</span>
        </div>
        `
      })
    })
    .catch((error) => console.error("Prognos-fetch not working:", error))
}

// --- EVENT LISTENERS --- 
searchBtn.addEventListener("click", () => {
  const userSearch = searchInput.value
  if (userSearch) {
    fetchWeather(userSearch)
    fetchForecast(userSearch)
    searchInput.value = ""
  }
})

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click()
  }
})

// --- INITIAL APP START --- 
fetchWeather("Tierp")
fetchForecast("Tierp")