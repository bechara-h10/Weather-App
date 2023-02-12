const API_KEY = '0e9386d6f244d9570fa53c0cc6c053e2'
const city = document.querySelector('.city')
const main = document.querySelector('.main')
const date = document.querySelector('.date')
const time = document.querySelector('.time')
const temp = document.querySelector('.temp')
const changeTempType = document.querySelector('.change-temp-type')
const todayWeatherLogo = document.querySelector('.today-weather-logo')
const searchLocation = document.getElementById('search-location')
const searchButton = document.getElementById('search-button')
const humidity = document.querySelector('.humidity .info')
const tempMin = document.querySelector('.temp-min .info')
const tempMax = document.querySelector('.temp-max .info')
const windSpeed = document.querySelector('.wind-speed .info')
const forecastDiv = document.querySelector('.forecast-container')
const snowVideo = document.querySelector('.snow-video')
const sunnyVideo = document.querySelector('.sunny-video')
const overcastVideo = document.querySelector('.overcast-video')
const rainVideo = document.querySelector('.rain-video')
const error = document.querySelector('.error')
let tempType = 'Celsius'

async function getWeatherInfo(input) {
  const URL = `http://api.openweathermap.org/data/2.5/weather?q=${input}&APPID=${API_KEY}`
  const response = await fetch(URL, { mode: 'cors' })
  const weatherInfo = await response.json()
  error.classList.remove('active')
  return weatherInfo
}

async function getForecastInfo(lat, lon) {
  const URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  const response = await fetch(URL)
  const forecastInfo = await response.json()
  return forecastInfo
}

function updateTodayInfo(input, tempType) {
  forecastDiv.innerText = ''
  getWeatherInfo(input)
    .then((weatherInfo) => {
      if (tempType == 'Fahrenheit') {
        temp.innerText = `${kelvintoFahrenheit(weatherInfo.main.temp)} °F`
        tempMin.innerText = `${kelvintoFahrenheit(
          weatherInfo.main.temp_min
        )} °F`
        tempMax.innerText = `${kelvintoFahrenheit(
          weatherInfo.main.temp_max
        )} °F`
        windSpeed.innerText = `${weatherInfo.wind.speed} mph`
      } else {
        temp.innerText = `${kelvinToCelsius(weatherInfo.main.temp)} °C`
        tempMin.innerText = `${kelvinToCelsius(weatherInfo.main.temp_min)} °C`
        tempMax.innerText = `${kelvinToCelsius(weatherInfo.main.temp_max)} °C`
        windSpeed.innerText = `${mileToKm(weatherInfo.wind.speed)} kmh`
      }
      humidity.innerText = `${weatherInfo.main.humidity} %`
      main.innerText = `${weatherInfo.weather[0].main}`
      city.innerText = weatherInfo.name
      date.innerText = new Date().toLocaleDateString()
      time.innerText = new Date().toLocaleTimeString()
      if (main.innerText === 'Overcast Clouds' || main.innerText === 'Clouds') {
        todayWeatherLogo.innerHTML = `<i class="fa-solid fa-cloud"></i>`
        overcastVideo.classList.add('active')
        snowVideo.classList.remove('active')
        sunnyVideo.classList.remove('active')
        rainVideo.classList.remove('active')
      } else if (main.innerText === 'Clear') {
        todayWeatherLogo.innerHTML = `<i class="fa-solid fa-sun"></i>`
        sunnyVideo.classList.add('active')
        overcastVideo.classList.remove('active')
        snowVideo.classList.remove('active')
        rainVideo.classList.remove('active')
      } else if (main.innerText === 'Snow') {
        todayWeatherLogo.innerHTML = `<i class="fa-solid fa-snowflake"></i>`
        snowVideo.classList.add('active')
        sunnyVideo.classList.remove('active')
        overcastVideo.classList.remove('active')
        rainVideo.classList.remove('active')
      } else if (main.innerText === 'Rain') {
        todayWeatherLogo.innerHTML = `<i class="fa-solid fa-cloud-rain"></i>`
        rainVideo.classList.add('active')
        snowVideo.classList.remove('active')
        sunnyVideo.classList.remove('active')
        overcastVideo.classList.remove('active')
      }
      displayForecast(weatherInfo.coord.lat, weatherInfo.coord.lon, tempType)
      error.style.display = 'none'
    })
    .catch((err) => {
      error.style.display = 'block'
    })
  searchLocation.value = ''
}

function displayForecast(lat, lon, tempType) {
  let weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  getForecastInfo(lat, lon).then((forecastInfo) => {
    forecastInfo.list.forEach((time) => {
      if (time.dt_txt.includes('00:00:00')) {
        const dayDiv = document.createElement('div')
        const dayTitle = document.createElement('div')
        const maxTempDiv = document.createElement('div')
        const minTempDiv = document.createElement('div')
        const logoDiv = document.createElement('div')
        dayDiv.classList.add('day-container')
        dayTitle.classList.add('day-title')
        maxTempDiv.classList.add('max-temp-day')
        minTempDiv.classList.add('min-temp-day')
        logoDiv.classList.add('day-logo-div')
        const date = new Date(time.dt_txt)
        dayTitle.innerText = weekDays[date.getDay()]
        if (tempType == 'Fahrenheit') {
          maxTempDiv.innerText = `${kelvintoFahrenheit(time.main.temp_max)} °F`
          minTempDiv.innerText = `${kelvintoFahrenheit(time.main.temp_min)} °F`
        } else {
          maxTempDiv.innerText = `${kelvinToCelsius(time.main.temp_max)} °C`
          minTempDiv.innerText = `${kelvinToCelsius(time.main.temp_min)} °C`
        }
        if (time.weather[0].main.includes('Clouds')) {
          logoDiv.innerHTML = `<i class="fa-solid fa-cloud"></i>`
        } else if (time.weather[0].main.includes('Snow')) {
          logoDiv.innerHTML = `<i class="fa-solid fa-snowflake"></i>`
        } else if (time.weather[0].main.includes('Clear')) {
          logoDiv.innerHTML = `<i class="fa-solid fa-sun"></i>`
        } else if (time.weather[0].main.includes('Rain')) {
          logoDiv.innerHTML = `<i class="fa-solid fa-cloud-rain"></i>`
        }
        const transformValue = -100 * date.getDate()
        const animationDuration = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--forecast-duration')
        dayDiv.style.transform = `translateX(${transformValue}%)`
        dayDiv.style.animation = `forecast-appear ${animationDuration}ms ease-in-out ${
          animationDuration * date.getDay()
        }ms forwards`
        dayDiv.appendChild(dayTitle)
        dayDiv.appendChild(maxTempDiv)
        dayDiv.appendChild(minTempDiv)
        dayDiv.appendChild(logoDiv)
        forecastDiv.appendChild(dayDiv)
      }
    })
  })
}

function kelvintoFahrenheit(temp) {
  return Math.floor((temp - 273.15) * (9 / 5) + 32)
}

function kelvinToCelsius(temp) {
  return Math.floor(temp - 273.15)
}

function mileToKm(speed) {
  return Math.floor(speed * 1.6)
}

searchButton.onclick = () => {
  updateTodayInfo(searchLocation.value, tempType)
}

window.onkeydown = (e) => {
  if (e.key === 'Enter') {
    updateTodayInfo(searchLocation.value, tempType)
  }
}

changeTempType.onclick = () => {
  if (changeTempType.innerText == 'Display °C') {
    changeTempType.innerText = 'Display °F'
    tempType = 'Celsius'
    updateTodayInfo(city.innerText, tempType)
  } else {
    changeTempType.innerText = 'Display °C'
    tempType = 'Fahrenheit'
    updateTodayInfo(city.innerText, tempType)
  }
}

window.onload = () => updateTodayInfo('Zgharta')
