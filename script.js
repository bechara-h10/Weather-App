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


 
async function getWeatherInfo(input){
  const URL = `http://api.openweathermap.org/data/2.5/weather?q=${input}&APPID=${API_KEY}`
  const response = await fetch(URL, {mode: 'cors'})
  const weatherInfo = await response.json()
  return weatherInfo
}

async function getForecastInfo(lat,lon){
  const URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  const response = await fetch(URL)
  const forecastInfo = await response.json()
  return forecastInfo
}

function updateTodayInfo(input){
  getWeatherInfo(input).then(weatherInfo => {
    temp.innerText = `${Math.floor(weatherInfo.main.temp/10)} °F`
    tempMin.innerText =`${Math.floor(weatherInfo.main.temp_min/10)} °F`
    tempMax.innerText = `${Math.floor(weatherInfo.main.temp_max/10)} °F`
    humidity.innerText = `${weatherInfo.main.humidity} %`
    main.innerText = `${weatherInfo.weather[0].main}`
    city.innerText = weatherInfo.name
    windSpeed.innerText = `${weatherInfo.wind.speed} mph`
    date.innerText = new Date().toLocaleDateString()
    time.innerText = new Date().toLocaleTimeString()
    if(main.innerText === 'Overcast Clouds' || main.innerText === 'Clouds'){
      todayWeatherLogo.innerHTML = `<i class="fa-solid fa-cloud"></i>`
    } else if(main.innerText === 'Clear'){
        todayWeatherLogo.innerHTML = `<i class="fa-solid fa-sun"></i>`
    } else if(main.innerText === 'Snow'){
        todayWeatherLogo.innerHTML = `<i class="fa-solid fa-snowflake"></i>`
    }
    getForecastInfo(weatherInfo.coord.lat,weatherInfo.coord.lon)
  })
  searchLocation.value = ''
} 


searchButton.onclick = () => {
  updateTodayInfo(searchLocation.value)
}

window.onkeydown = (e) => {
  if(e.key === 'Enter'){
    updateTodayInfo(searchLocation.value)
  }
}

updateTodayInfo('London')
