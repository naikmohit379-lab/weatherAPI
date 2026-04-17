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