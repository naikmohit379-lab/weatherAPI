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
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
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

function displayCurrentWeather(data) {
    let tempC = data.main.temp - 273.15;

    currentTempCelsius = tempC;
    isCelsius = true;

    cityName.textContent = data.name + ", " + data.sys.country;
    weatherDesc.textContent = data.weather[0].description;
    temperature.textContent = tempC.toFixed(1) + "°C";
    toggleUnitBtn.textContent = "switch to °F";

    humidity.textContent = data.main.humidity + "%";
    wind.textContent = data.wind.speed + " m/s";
    condition.textContent = data.weather[0].main;

    if (tempC > 40) {
        weatherAlert.textContent = "Warning: extreme temperature above 40°C";
        weatherAlert.classList.remove("hidden");
    } else {
        weatherAlert.classList.add("hidden");
    }

    if (data.weather[0].main.toLowerCase().includes("rain")) {
        body.className = "bg-slate-700 text-white min-h-screen";
    } else {
        body.className = "bg-slate-900 text-white min-h-screen";
    }
}
function displayForecast(data) {
    forecastContainer.innerHTML = "";

    let forecastList = data.list;
    let shownDates = [];

    for (let i = 0; i < forecastList.length; i++) {
        let item = forecastList[i];
        let date = item.dt_txt.split(" ")[0];

        if (!shownDates.includes(date) && shownDates.length < 5) {
            shownDates.push(date);

            let temp = (item.main.temp - 273.15).toFixed(1);

            forecastContainer.innerHTML += `
                <div class="bg-slate-700 p-3 rounded text-center">
                    <p class="font-semibold">${date}</p>
                    <p class="mt-2">Temp: ${temp}°C</p>
                    <p>Wind: ${item.wind.speed} m/s</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p class="mt-1 text-sm">${item.weather[0].main}</p>
                </div>
            `;
        }
    }
}
locationBtn.addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                getWeatherByLocation(lat, lon);
            },
            function () {
                showError("Unable to get your location.");
            }
        );
    } else {
        showError("Geolocation is not supported in your browser.");
    }
});

async function getWeatherByLocation(lat, lon) {
    clearError();

    try {
        let currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (!currentResponse.ok) {
            showError("Unable to fetch weather for your location.");
            return;
        }

        let currentData = await currentResponse.json();

        let forecastResponse = await fetch(
             `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        let forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        saveRecentCity(currentData.name);

    } catch (error) {
        showError("Unable to fetch weather for your location.");
    }
}
toggleUnitBtn.addEventListener("click", function () {
    if (currentTempCelsius === null) return;

    if (isCelsius) {
        let tempF = (currentTempCelsius * 9 / 5) + 32;
        temperature.textContent = tempF.toFixed(1) + "°F";
        toggleUnitBtn.textContent = "Switch to °C";
        isCelsius = false;
    } else {
        temperature.textContent = currentTempCelsius.toFixed(1) + "°C";
        toggleUnitBtn.textContent = "Switch to °F";
        isCelsius = true;
    }
});
function saveRecentCity(city) {
    city = city.trim();

    recentCities = recentCities.filter(function (item) {
        return item.toLowerCase() !== city.toLowerCase();
    });

    recentCities.unshift(city);

    if (recentCities.length > 5) {
        recentCities.pop();
    }

    localStorage.setItem("recentCities", JSON.stringify(recentCities));
    loadRecentCities();
}

function loadRecentCities() {
    recentDropdown.innerHTML = "";

    if (recentCities.length === 0) {
        recentBtn.classList.add("hidden");
        return;
    }

    recentBtn.classList.remove("hidden");

    for (let i = 0; i < recentCities.length; i++) {
        let btn = document.createElement("button");
        btn.textContent = recentCities[i];
        btn.className = "block w-full text-left px-3 py-2 bg-slate-600 rounded hover:bg-slate-500";

        btn.addEventListener("click", function () {
            cityInput.value = recentCities[i];
            getWeatherByCity(recentCities[i]);
            recentDropdown.classList.add("hidden");
        });

        recentDropdown.appendChild(btn);
    }
}

recentBtn.addEventListener("click", function () {
    recentDropdown.classList.toggle("hidden");
});