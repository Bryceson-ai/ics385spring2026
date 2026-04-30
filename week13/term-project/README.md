# Maui Luxury Vacation Rentals - Week 13 Dashboard

Student: Bryceson Gaoiran  
Course: ICS 385 Spring 2026  
Assignment: HW13-C React Dashboard  

## Overview

This Week 13 checkpoint extends the Maui marketing page into a modular dashboard experience that will be reused in Weeks 14-15 for protected admin views. The app now includes a dashboard module with an island selector, a weather widget powered by OpenWeatherMap, a KPI row, and three Chart.js visualizations built with react-chartjs-2.

The dashboard is intentionally self-contained so it can later be rendered inside an authenticated /admin/dashboard route without rewriting the chart logic.

The chart and KPI components now fetch their island-specific data from the Express backend through /api endpoints proxied by Vite during development.

## What Was Built

Marketing page:
- Existing Hero, About, Amenities, CTA, and Footer sections remain intact.
- Header and CTA now include a View Dashboard action.

Dashboard module:
- Dashboard header with property name and tagline
- Island selector using useState
- WeatherWidget that updates when island changes
- MetricCards row with ADR, occupancy, and average length of stay
- ArrivalChart bar chart
- OriginChart doughnut chart
- TrendChart line chart for average stay trend

## Chart Summary

1. ArrivalChart
- Type: Bar chart
- Source: Express route /api/arrivals?island=...
- Behavior: re-filters when island changes

2. OriginChart
- Type: Doughnut chart
- Source: Express route /api/origins?island=...
- Categories: U.S. domestic, Japan, Canada, other international
- Behavior: updates with island selection

3. TrendChart
- Type: Line chart
- Source: Express route /api/stay-trends?island=...
- Purpose: show average stay trend over recent post-COVID years

KPI cards:
- Average Daily Rate (ADR)
- Occupancy Rate
- Average Length of Stay computed with Array.reduce() after fetching /api/metrics?island=...

## Data Notes

This project uses DBEDT-style tourism data served by the Express backend. The current analytics endpoints are lightweight static-data routes so the frontend can demonstrate real API integration now and swap to database-backed analytics later.

Weather data is live and uses OpenWeatherMap through Vite environment variables.

## Project Structure

```text
week13/term-project/
├── .env.example
├── src/
│   ├── App.jsx
│   ├── Dashboard.jsx
│   ├── styles.css
│   ├── charts/
│   │   ├── ArrivalChart.jsx
│   │   ├── OriginChart.jsx
│   │   ├── TrendChart.jsx
│   │   └── chartSetup.js
│   └── components/
│       ├── Header.jsx
│       ├── HeroSection.jsx
│       ├── About.jsx
│       ├── Amenities.jsx
│       ├── CTASection.jsx
│       ├── MetricCards.jsx
│       ├── WeatherWidget.jsx
│       └── Footer.jsx
└── README.md
```

Related backend routes live in Term3Project/routes/dashboard.js and are mounted by Term3Project/server.js.

## Setup

1. Open the project folder:

```bash
cd week13/term-project
```

2. Install dependencies:

```bash
npm install
```

3. Create a local environment file from .env.example and add your OpenWeatherMap key.

4. Start the dev server:

```bash
npm run dev
```

5. Start the Express backend in a separate terminal:

```bash
cd Term3Project
npm install
npm start
```

This exposes the analytics and property routes on http://localhost:3000.

6. Build for production:

```bash
npm run build
```

## Environment Variables

Required local environment values:

```env
VITE_WEATHER_KEY=your_openweathermap_key_here
MONGODB_URI=your_mongodb_atlas_connection_string
```

The frontend dev server proxies /api requests to http://localhost:3000.

## Reflection

For Week 13, I built a modular React dashboard that extends my Week 12 marketing page with an island selector, three Chart.js visualizations (arrivals, origin mix, and stay trend), KPI cards, and a live OpenWeatherMap widget, then connected the chart/KPI layer to Express API routes so the frontend behaves like a true client instead of a static mock page. The most important part I completed was state-driven updates across multiple components when the selected island changes, which makes the dashboard reusable for future admin workflows. In Weeks 14-15, I plan to add route-based navigation with React Router, replace the temporary analytics arrays with seeded DBEDT-backed data storage, and wrap this same Dashboard component behind authentication on /admin/dashboard using Passport.js or JWT so access control can be added without rewriting the charts.

## AI Attribution

AI tools used:
- GitHub Copilot using GPT-5.4 for code scaffolding, refactoring, and README drafting

AI-assisted areas:
- Dashboard component structure
- Chart.js/react-chartjs-2 setup
- CSS layout refinements
- Weather widget error handling
- Documentation updates

## Submission Notes

- Submit the GitHub folder URL for week13/term-project.
- Capture browser screenshots showing the KPI row plus all three charts.
- Generated screenshots are in docs/screenshots/dashboard-all-charts.png, docs/screenshots/chart-1.png, docs/screenshots/chart-2.png, and docs/screenshots/chart-3.png.
- Make sure the Express backend is running on port 3000 before taking screenshots so the charts can load.
- If the weather widget shows a setup message instead of live weather, add a local .env file with VITE_WEATHER_KEY before taking screenshots.

