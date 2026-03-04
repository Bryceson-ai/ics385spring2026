# UH Maui Campus Dashboard (ICS 385 - Week 8)

Intermediate multi-API dashboard project that combines local course catalog data with live weather and humor APIs.

## Project Structure

```text
week8/intermediate-dashboard/
	index.html
	styles.css
	config.js
	api-client.js
	course-catalog.js
	dashboard.js
	sample-data.json
	.env.example
	README.md
```

## Features Implemented

- Multi-API integration:
	- OpenWeatherMap (current weather for Kahului)
	- JokeAPI (programming joke)
	- RapidAPI Chuck Norris Jokes
- Secure configuration flow for local development:
	- `.env.example` template provided
	- Runtime key entry modal and localStorage storage for testing
- Error handling and graceful degradation:
	- Timeout handling
	- Fallback weather/joke data when API calls fail
	- User-facing status messages
- Caching strategy:
	- In-memory response cache with expiration (`CACHE_DURATION` equivalent behavior)
- Rate limiting:
	- Per-service request windows and fallback behavior on limit exceed
- Responsive design:
	- Desktop/tablet/mobile layouts in `styles.css`
- Data integration:
	- Local `sample-data.json` + live API widgets in one dashboard
- Real-time updates:
	- Automatic weather refresh based on settings
	- Manual joke refresh button
- Course management (CRUD):
	- Add, edit, delete, search/filter, and export
- Dashboard data export:
	- Exports combined courses + API state + settings as JSON
- Settings management:
	- User prompt to configure auto-refresh interval

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Fill in your real keys:

```env
# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your_openweather_api_key_here
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# RapidAPI Configuration for Chuck Norris Jokes
RAPIDAPI_KEY=your_rapidapi_key_here
RAPIDAPI_HOST=matchilling-chuck-norris-jokes-v1.p.rapidapi.com

# Application Configuration
APP_NAME=UH Maui Campus Dashboard
DEFAULT_CITY=Kahului
CACHE_DURATION=600000
API_TIMEOUT=5000

# Development Settings
DEBUG_MODE=true
LOG_LEVEL=info
```

3. Start a local static server and open `index.html`.
4. Use **Settings** / API modal to enter keys for browser runtime testing.
5. `.env` is excluded from version control by `.gitignore`; only `.env.example` should be committed.

> Note: This project is browser-based. `.env` is included for assignment/security documentation and backend-ready configuration patterns. Client-only apps cannot fully hide API keys.

## API Setup Guide

### OpenWeatherMap
- Sign up: https://openweathermap.org/
- Generate API key
- Test endpoint:
	- `https://api.openweathermap.org/data/2.5/weather?q=Kahului,US&appid=YOUR_KEY&units=imperial`

### RapidAPI (Chuck Norris)
- Sign up: https://rapidapi.com/
- Subscribe to: `matchilling-chuck-norris-jokes-v1`
- Use key in `X-RapidAPI-Key`

### JokeAPI
- No key required
- Test endpoint:
	- `https://sv443.net/jokeapi/v2/joke/Programming?type=single`

## Security Checklist

- [x] `.env.example` committed; real `.env` ignored by `.gitignore`
- [x] API key validation before calling protected APIs
- [x] No API keys hardcoded in source files
- [x] Fallback mode when keys are missing or invalid
- [x] Error messages avoid exposing secrets
- [ ] Full key secrecy from end users (**requires backend proxy/server**)

## Testing Requirements Coverage

### 1) API Connectivity
- Test OpenWeather only
- Test RapidAPI only
- Test JokeAPI only
- Test all three simultaneously using **Refresh All**

### 2) Error Scenarios
- Missing keys: do not enter API keys and verify fallback data
- Invalid keys: enter fake keys and verify graceful errors/fallback
- Network failure: disable network in browser dev tools and test widgets
- Rate limits: trigger repeated refreshes and verify rate-limit fallback behavior

### 3) Data Integration
- Confirm course cards render with local JSON data
- Confirm weather + jokes render at same time as course cards
- Confirm stats card updates reflect course totals and API status

### 4) Responsive Design
- Test widths: `360px`, `768px`, `1024px`, `1440px`
- Verify no clipped controls/buttons/cards on each width

### 5) Performance
- Duplicate/expand course dataset in `sample-data.json` (50+ courses)
- Verify search/filter and dashboard rendering remain responsive

### 6) Caching
- Call same API action twice within cache window
- Verify quick return behavior and reduced outbound calls

### 7) User Experience
- Validate all buttons, modals, form validation, and status messages
- Verify weather auto-refresh and manual joke refresh behavior

## Testing Documentation Template

Use this table to record submission evidence:

| Test Area | Status | Notes | Screenshot |
|---|---|---|---|
| API Connectivity | Pending Manual Run |  | Add file path/link |
| Error Scenarios | Pending Manual Run |  | Add file path/link |
| Data Integration | Pending Manual Run |  | Add file path/link |
| Responsive Design | Pending Manual Run |  | Add file path/link |
| Performance (Large Dataset) | Pending Manual Run |  | Add file path/link |
| Security Checklist Verification | Pending Manual Run |  | Add file path/link |
| Caching Verification | Pending Manual Run |  | Add file path/link |
| UX Interaction Pass | Pending Manual Run |  | Add file path/link |

## Submission Checklist

- [x] Functional interface and code
- [x] Multi-API integration and error handling
- [x] `.env.example` included
- [x] Security checklist documented
- [x] Comprehensive README and setup guide
- [x] Testing plan documented
- [ ] Manual test results + screenshots added before final submit

## Notes on Security Reality for Frontend-Only Apps

For production security, move API calls to a backend proxy and keep real API keys server-side only. This assignment includes frontend-safe patterns and documentation, but frontend JavaScript cannot guarantee key secrecy.
