# HW15-A Google OAuth Demo

Standalone Express application for ICS 385 Week 15A demonstrating Passport Google OAuth 2.0 with MongoDB persistence and session authentication.

## Folder URL
- Add your GitHub folder link here after push: `https://github.com/Bryceson-ai/ics385spring2026/tree/main/week15/hw15a`

## Setup
```bash
cd week15/hw15a
npm install
npm start
```

Create a `.env` file from `.env.example` and add your real Google and MongoDB credentials before running.

## Routes
- `GET /` home page with **Sign in with Google** button
- `GET /auth/google` starts OAuth flow
- `GET /auth/google/callback` handles callback and creates session
- `GET /profile` protected profile page
- `POST /logout` logs user out and destroys session

## Required Screenshots
1. Google consent screen showing your app name

![Google consent screen](./docs/google-consent-screen.png)

2. Profile page after successful login (email + displayName + _id)

![Profile page](./docs/profile-page.png)

3. MongoDB Atlas or Compass user document in `users` collection

![MongoDB users document](./docs/mongodb-user-document.png)

## Reflection (100-150 words)
Google OAuth simplified one of the hardest parts of authentication by outsourcing credential verification, password recovery, and identity confirmation to a trusted provider. Instead of building and securing a local password system for this assignment, I only needed to configure Passport with the Google strategy and handle the callback lifecycle. That reduced friction for sign-in and made the flow feel more production-like. At the same time, OAuth added new responsibilities: I still must manage session security, protect secrets in `.env`, configure redirect URIs correctly, and validate that user records are persisted safely in MongoDB. I also had to understand serialize/deserialize behavior so protected routes work consistently across requests. This exercise helped me separate identity federation from application authorization, which will make Week 15C integration into the term project cleaner and less error-prone.

## AI Tools Used
- GitHub Copilot (GPT-5.3-Codex) for scaffolding route structure, view templates, and README drafting.
- Human review and manual verification for assignment requirement alignment and route behavior.
