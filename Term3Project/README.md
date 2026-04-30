# Term3Project - Week 14C Admin Authentication

This project integrates admin authentication into the Hawaii Hospitality Dashboard using Passport.js LocalStrategy, session-based auth, bcrypt password hashing, and MongoDB Atlas.

## Added Components
- `models/User.js`
- `passport-config.js`
- `routes/auth.js`
- `routes/admin.js`
- `middleware/isAuthenticated.js`
- `seed-admin.js`

## Auth Routes
- `GET /admin/login`
- `POST /admin/login`
- `GET /admin/logout`
- `GET /admin/dashboard` (protected)

## Setup
```bash
cd Term3Project
npm install
```

Create `.env` from `.env.example` and set values.

Seed property data (optional):
```bash
npm run seed
```

Seed admin account once:
```bash
npm run seed-admin
```

Start server:
```bash
npm start
```

## Admin Account for Grading
- Admin email seeded/documented: `admin@mauiluxury.example.com`
- Password is intentionally not documented in README.
