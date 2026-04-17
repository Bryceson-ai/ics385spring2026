import { useEffect, useState } from "react";

function toCelsius(tempFahrenheit) {
  return ((tempFahrenheit - 32) * 5) / 9;
}

function WeatherWidget({ city }) {
  const apiKey = import.meta.env.VITE_WEATHER_KEY;
  const [state, setState] = useState({ status: "idle", data: null, message: "" });

  useEffect(() => {
    if (!apiKey) {
      setState({
        status: "error",
        data: null,
        message: "Add VITE_WEATHER_KEY to a local .env file to load live weather.",
      });
      return;
    }

    const controller = new AbortController();

    async function loadWeather() {
      setState({ status: "loading", data: null, message: "" });

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},HI,US&appid=${encodeURIComponent(apiKey)}&units=imperial`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to load weather right now.");
        }

        const data = await response.json();
        setState({ status: "success", data, message: "" });
      } catch (error) {
        if (error.name !== "AbortError") {
          setState({
            status: "error",
            data: null,
            message: "Weather data unavailable. Please try again later.",
          });
        }
      }
    }

    loadWeather();

    return () => controller.abort();
  }, [apiKey, city]);

  return (
    <aside className="weather-card" aria-live="polite">
      <div className="weather-top">
        <div>
          <p className="dashboard-kicker">Live Weather</p>
          <h3>{city}</h3>
          <p className="weather-meta">OpenWeatherMap current conditions</p>
        </div>
        {state.status === "success" && state.data?.weather?.[0]?.icon ? (
          <img
            src={`https://openweathermap.org/img/wn/${state.data.weather[0].icon}@2x.png`}
            alt={state.data.weather[0].description}
            width="72"
            height="72"
          />
        ) : null}
      </div>

      {state.status === "loading" ? <p className="weather-status">Loading weather...</p> : null}
      {state.status === "error" ? <p className="weather-status">{state.message}</p> : null}

      {state.status === "success" ? (
        <>
          <p className="weather-city">{state.data.name}</p>
          <p className="weather-temp">
            {Math.round(state.data.main.temp)}F / {Math.round(toCelsius(state.data.main.temp))}C
          </p>
          <p className="weather-meta">{state.data.weather[0].description}</p>
          <div className="weather-grid">
            <div className="weather-detail">
              <strong>Humidity</strong>
              <span>{state.data.main.humidity}%</span>
            </div>
            <div className="weather-detail">
              <strong>Feels like</strong>
              <span>{Math.round(state.data.main.feels_like)}F</span>
            </div>
          </div>
        </>
      ) : null}
    </aside>
  );
}

export default WeatherWidget;