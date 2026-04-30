Live URL: [Add your Render URL here after deployment]

# Hawaii Hospitality Dashboard

A three-page full-stack hospitality app with a marketing page, visitor analytics dashboard, and a protected admin interface secured by local and Google OAuth authentication.

## Setup

1. Clone the repository.
2. Copy `.env.example` to `.env`.
3. Fill in `MONGO_URI`, `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENWEATHER_API_KEY`, and `NODE_ENV`.
4. Run `npm install`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

## Technology Stack

- Node.js
- Express
- EJS
- MongoDB + Mongoose
- Passport LocalStrategy
- passport-google-oauth20
- express-session + connect-mongo
- Helmet.js
- express-validator
- Chart.js
- Jest + Supertest
- OpenWeatherMap API

## Repository Structure

- `app.js` - shared Express app entry
- `config/passport.js` - local and Google authentication strategies
- `routes/public.js` - marketing page, visitor dashboard, analytics APIs, weather proxy
- `routes/auth.js` - login, register, Google OAuth callback, logout
- `routes/admin.js` - protected admin routes and property creation
- `models/` - Mongoose schemas for users and properties
- `tests/auth.test.js` - acceptance-criteria integration tests
- `docs/` - PRD and screenshots

## Acceptance Criteria Results

| Acceptance Criterion | Result | Notes |
|---|---|---|
| AC-1 Marketing page returns 200 and shows property name, hero image, and 3+ amenities | Pass | Verified at `/` with featured property content and amenity pills. |
| AC-2 Visitor dashboard renders three visualizations with non-empty data | Pass | Verified at `/dashboard` with arrivals, origins, and stay-trend canvases fed from `/api/*` routes. |
| AC-3 Local sign-up creates account and stores hashed password | Pass | Covered by `tests/auth.test.js` register test. |
| AC-4 Local sign-in redirects to `/admin/dashboard` and sets session cookie | Pass | Covered by `tests/auth.test.js` login test. |
| AC-5 Google OAuth sign-in redirects to `/admin/dashboard` and persists `googleId` | Pass | Covered by mocked callback flow in `tests/auth.test.js`; production callback uses Passport GoogleStrategy. |
| AC-6 Protected admin route redirects unauthenticated visitor to `/login` | Pass | Verified manually and covered by `tests/auth.test.js`. |
| AC-7 Logout clears session and blocks next protected request | Pass | Covered by `tests/auth.test.js` logout test. |
| AC-8 Secret hygiene keeps `.env` out of the repo and `.env.example` committed | Pass | `.gitignore` excludes `.env`, and `.env.example` is present at repo root. |

## Test Output Screenshot

Add your screenshot to `docs/screenshots/jest-auth-tests-green.png` and embed it here before your final submission.

## Deployment Notes

- Deploy on Render using the repo root.
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables from `.env.example` in the Render dashboard.
- Add your production Google OAuth callback URL: `https://yourapp.onrender.com/auth/google/callback`
- Warm the free-tier instance before the Week 16 code review.

## AI Tools Used

- GitHub Copilot (GPT-5.4): scaffolding Express routes, authentication wiring, EJS view structure, and test boilerplate.
- ChatGPT: grammar cleanup and README/PRD formatting support.

I can explain all generated code, route logic, model fields, middleware behavior, and test coverage in the repository.
