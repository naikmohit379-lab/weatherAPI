# weather forecast app

## about
- This is weather forcast app where we can get   details of weather in a particular place in that day along with 5 day forcast report 


## Technologies Used

- html
- css framework that is talwind css
- javascript
- Openweather API
- Browser geolocation API

## Features

- Search weather by **city name**
- Get weather for **current location** using browser geolocation
- Display **current weather**:
  - City name and country
  - Temperature in °C (with toggle between °C and °F for today)
  - Weather description
  - Humidity
  - Wind speed
  - Condition (e.g., Clear, Clouds, Rain)
- Display **5-day forecast** (one card per day with date, temp, wind, humidity, and condition)
- **Recent cities dropdown** using `localStorage`
- Simple **input validation** for empty city name
- Friendly **error messages** on the UI (no JavaScript alert boxes)
- **Custom alert** for extreme heat (above 40°C)
 

 ## API Reference

- OpenWeatherMap API: https://openweathermap.org/api  
- Current weather endpoint: https://api.openweathermap.org/data/2.5/weather  
- 5-day / 3-hour forecast endpoint: https://api.openweathermap.org/data/2.5/forecast [web:33][web:36]