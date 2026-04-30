# Week14b Passport Authentication Demo

Standalone Express app demonstrating username-or-email authentication using Passport LocalStrategy and bcrypt.

## Tech Used
- Express
- express-session
- Passport.js (LocalStrategy)
- bcrypt

## Run
```bash
cd Week14b
npm install
npm start
```

Open: http://localhost:3000

## Main Routes
- `/` Home
- `/register` Create account
- `/login` Login with username or email
- `/dashboard` Protected page (requires login)
- `POST /logout` Logout

## Notes
- This is a standalone assignment app (separate from the term project).
- User data is stored in memory for demo purposes.
