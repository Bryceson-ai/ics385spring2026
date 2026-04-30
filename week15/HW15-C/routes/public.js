const express = require('express');
const propertyStore = require('../lib/propertyStore');
const { arrivals, origins, metrics, stayTrends } = require('../data/dashboardData');

const router = express.Router();

const islandOptions = ['Maui', "O'ahu", "Kaua'i"];
const cityMap = {
  Maui: 'Kihei,HI,US',
  "O'ahu": 'Honolulu,HI,US',
  "Kaua'i": 'Lihue,HI,US'
};

function normalizeIsland(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/[ '\u2018\u2019`]/g, '');
}

function islandMatches(recordIsland, queryIsland) {
  if (!queryIsland) {
    return true;
  }

  return normalizeIsland(recordIsland) === normalizeIsland(queryIsland);
}

router.get('/', async (req, res, next) => {
  try {
    const properties = await propertyStore.listProperties({ island: 'Maui' });
    const featuredProperty = properties[0] || propertyStore.seedProperties[0];

    res.render('home', {
      pageTitle: 'Maui Luxury Vacation Rentals',
      featuredProperty,
      amenities: featuredProperty.amenities.slice(0, 5),
      islandOptions
    });
  } catch (error) {
    next(error);
  }
});

router.get('/dashboard', async (req, res, next) => {
  try {
    const properties = await propertyStore.listProperties({ island: 'Maui' });
    const featuredProperty = properties[0] || propertyStore.seedProperties[0];

    res.render('dashboard', {
      pageTitle: 'Visitor Dashboard',
      featuredProperty,
      islandOptions
    });
  } catch (error) {
    next(error);
  }
});

router.get('/api/properties', async (req, res, next) => {
  try {
    const filter = req.query.island ? { island: req.query.island } : {};
    const properties = await propertyStore.listProperties(filter);
    res.json(properties);
  } catch (error) {
    next(error);
  }
});

router.get('/api/arrivals', (req, res) => {
  res.json(arrivals.filter((row) => islandMatches(row.island, req.query.island)));
});

router.get('/api/origins', (req, res) => {
  const data = origins.find((row) => islandMatches(row.island, req.query.island));
  if (!data) {
    return res.status(404).json({ error: 'Island data not found.' });
  }

  return res.json(data);
});

router.get('/api/metrics', (req, res) => {
  const data = metrics.find((row) => islandMatches(row.island, req.query.island));
  if (!data) {
    return res.status(404).json({ error: 'Island data not found.' });
  }

  return res.json(data);
});

router.get('/api/stay-trends', (req, res) => {
  res.json(stayTrends.filter((row) => islandMatches(row.island, req.query.island)));
});

router.get('/api/weather', async (req, res) => {
  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(503).json({ error: 'Weather service is not configured.' });
  }

  const city = cityMap[req.query.island] || cityMap.Maui;

  try {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Weather API returned ${weatherResponse.status}`);
    }

    const weather = await weatherResponse.json();
    return res.json({
      temperatureF: weather.main.temp,
      temperatureC: Number(((weather.main.temp - 32) * (5 / 9)).toFixed(1)),
      humidity: weather.main.humidity,
      description: weather.weather?.[0]?.description || 'Unavailable',
      icon: weather.weather?.[0]?.icon || null,
      city: weather.name,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(502).json({ error: 'Weather data is unavailable right now.' });
  }
});

module.exports = router;
