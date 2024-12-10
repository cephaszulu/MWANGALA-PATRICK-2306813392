document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "5eeb86f717bfaa6bf4b43668e0dee848"; // Replace with your OpenWeatherMap API key
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast"; // 5-day forecast endpoint

    const defaultCity = "SOLWEZI"; // Default city
    fetchWeatherData(defaultCity);

    // Event listener for the search button
    document.getElementById("search-btn").addEventListener("click", function () {
        const city = document.getElementById("city-input").value.trim();
        if (city) {
            fetchWeatherData(city);
        } else {
            alert("Please enter a city name.");
        }
    });

    // Function to fetch weather data
    function fetchWeatherData(city) {
        fetch(`${apiUrl}?q=${city}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === "200") {
                    updateCurrentWeather(data); // Show current weather
                    updateForecast(data); // Show 5-day forecast
                } else {
                    alert("City not found. Please enter a valid city name.");
                }
            })
            .catch(error => {
                console.log("Error fetching data:", error);
                alert("Failed to fetch weather data. Please try again.");
            });
    }

    // Function to update the current weather display
    function updateCurrentWeather(data) {
        const currentWeather = document.getElementById("current-weather");
        const cityName = data.city.name;
        const temperature = Math.round(data.list[0].main.temp);
        const weatherDescription = data.list[0].weather[0].main;
        const iconCode = data.list[0].weather[0].icon;
        const weatherIconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const windSpeed = data.list[0].wind.speed; // Wind speed in meters per second
        const humidity = data.list[0].main.humidity; // Humidity percentage

        // Set background based on weather condition
        setBackgroundImage(weatherDescription);

        const weatherHtml = `
            <h2>${cityName}</h2>
            <img src="${weatherIconUrl}" alt="${weatherDescription}" />
            <h3>${temperature}°C</h3>
            <p>${weatherDescription}</p>
            <p>Wind: ${windSpeed} m/s</p>
            <p>Humidity: ${humidity}%</p>
        `;

        currentWeather.innerHTML = weatherHtml;
    }

    // Function to update the 5-day forecast display
    function updateForecast(data) {
        const forecastContainer = document.getElementById("forecast-container");
        forecastContainer.innerHTML = ""; // Clear previous forecast

        const dailyData = groupByDay(data.list);

        dailyData.forEach(day => {
            const dayWeather = day[0]; // Take the first forecast of each day
            const date = new Date(dayWeather.dt * 1000);
            const dayOfWeek = date.toLocaleDateString("en-US", { weekday: 'short' });
            const minTemp = Math.round(Math.min(...day.map(d => d.main.temp_min)));
            const maxTemp = Math.round(Math.max(...day.map(d => d.main.temp_max)));
            const description = dayWeather.weather[0].main;
            const iconCode = dayWeather.weather[0].icon;
            const weatherIconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
            const windSpeed = dayWeather.wind.speed; // Wind speed in meters per second
            const humidity = dayWeather.main.humidity; // Humidity percentage

            const forecastHtml = `
                <div class="forecast">
                    <h4>${dayOfWeek}</h4>
                    <img src="${weatherIconUrl}" alt="${description}" />
                    <p>${minTemp}°C - ${maxTemp}°C</p>
                    <p>${description}</p>
                    <p>Wind: ${windSpeed} m/s</p>
                    <p>Humidity: ${humidity}%</p>
                </div>
            `;
            forecastContainer.innerHTML += forecastHtml;
        });
    }

    // Helper function to group forecast data by day
    function groupByDay(forecast) {
        const grouped = [];
        forecast.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toISOString().split("T")[0]; // Get date in YYYY-MM-DD format

            if (!grouped[day]) {
                grouped[day] = [];
            }

            grouped[day].push(item);
        });
        return Object.values(grouped);
    }

    // Function to set background image based on weather description
    function setBackgroundImage(weatherDescription) {
        let backgroundImageUrl = "";

        // Map weather conditions to background images
        switch (weatherDescription.toLowerCase()) {
            case "clear":
            case "sunny":
                backgroundImageUrl = "url('images/sunny.jpg')";
                break;
            case "clouds":
                backgroundImageUrl = "url('images/cloudy.jpg')";
                break;
            case "rain":
                backgroundImageUrl = "url('images/rainy.jpg')";
                break;
            case "snow":
                backgroundImageUrl = "url('images/snowy.jpg')";
                break;
            case "thunderstorm":
                backgroundImageUrl = "url('images/thunder.jpg')";
                break;
            case "drizzle":
                backgroundImageUrl = "url('images/drizzle.jpg')";
                break;
            default:
                backgroundImageUrl = "url('images/default.jpg')";
        }

        // Change the background image of the body
        document.body.style.backgroundImage = backgroundImageUrl;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center center";
        document.body.style.transition = "background-image 0.5s ease-in-out";
    }
});

