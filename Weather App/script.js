const apiKey = "692f289f25f0250b4dbaad79b79f3b44";  // Your API KEY

async function getWeather() {
    const city = document.getElementById("cityInput").value;
    const loader = document.getElementById("loader");
    const card = document.getElementById("weatherCard");
    const error = document.getElementById("errorMsg");

    if (!city) return;

    loader.classList.remove("hidden");
    card.classList.add("hidden");
    error.classList.add("hidden");

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod === "404") {
            loader.classList.add("hidden");
            error.classList.remove("hidden");
            return;
        }

        document.getElementById("cityName").innerHTML = `${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").innerHTML = `${data.main.temp}°C`;
        document.getElementById("description").innerHTML = data.weather[0].description;
        document.getElementById("feels").innerHTML = `${data.main.feels_like}°C`;
        document.getElementById("humidity").innerHTML = `${data.main.humidity}%`;
        document.getElementById("wind").innerHTML = `${data.wind.speed} km/h`;

        const iconCode = data.weather[0].icon;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        loader.classList.add("hidden");
        card.classList.remove("hidden");

    } catch (err) {
        loader.classList.add("hidden");
        error.classList.remove("hidden");
    }
}
