const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Use values from .env even if the shell has stale vars from earlier runs.
dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

app.use(express.static(__dirname));

app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon query parameter." });
  }

  if (!API_KEY || API_KEY === "PASTE_YOUR_REAL_KEY_HERE") {
    return res.status(500).json({
      error: "OPENWEATHER_API_KEY is missing or still placeholder in .env"
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${encodeURIComponent(API_KEY)}&units=imperial`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `OpenWeather request failed with HTTP ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data.", detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
