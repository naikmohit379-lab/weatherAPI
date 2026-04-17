const apiKey = "02276dc7547322d009c6e76b147f399f";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const recentBtn = document.getElementById("recentBtn");
const recentDropdown = document.getElementById("recentDropdown");

const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const condition = document.getElementById("condition");

const toggleUnitBtn = document.getElementById("toggleUnitBtn");
const weatherAlert = document.getElementById("weatherAlert");
const errorMessage = document.getElementById("errorMessage");
const forecastContainer = document.getElementById("forecastContainer");
const body = document.getElementById("body");

let currentTempCelsius = null;
let isCelsius = true;
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
}

function clearError() {
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");
}

searchBtn.addEventListener("click", function () {
    let city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeatherByCity(city);
});

async function getWeatherByCity(city) {
    clearError();

    try {
        let currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );

        if (!currentResponse.ok) {
            showError("City not found. Please enter a valid city.");
            return;
        }

        let currentData = await currentResponse.json();

        let lat = currentData.coord.lat;
        let lon = currentData.coord.lon;

        let forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );

        let forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        saveRecentCity(city);

    } catch (error) {
        showError("Something went wrong while fetching weather data.");
    }
}