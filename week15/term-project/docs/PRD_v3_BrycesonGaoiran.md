# Product Requirements Document (PRD v3)

## 1. Cover

- Project Name: Maui Luxury Vacation Rentals Dashboard
- Student: Bryceson Gaoiran
- Island: Maui
- Target Visitor Segment: Canadian travelers escaping winter
- Live Deployment URL: [PASTE LIVE URL]
- GitHub URL: [PASTE REPO URL]
- Version: v3 - May 1, 2026
- Date: [PASTE DATE]

## 2. Problem Statement and Target User

### Problem Statement (carry forward from v2 with light edits)

The application solves two connected problems: a visitor decision problem and an operator planning problem. Visitors need to quickly evaluate rental options, pricing context, and trust signals before committing to a booking inquiry. The property operator needs one consolidated experience for demand visibility, route-level protection, and secure access to admin tools that affect listing quality and business outcomes.

### Target User (carry forward from v2 with light edits)

Primary user is a Canadian traveler planning a Maui trip during winter months, typically comparing value, comfort, and location before booking. Secondary user is the local property admin who must securely manage listing content, monitor dashboard signals, and maintain data integrity without exposing admin functions to public visitors.

## 3. Functional Requirements

Use your own wording for each requirement. Mark new items added this week with [NEW v3].

- R1: Public marketing page renders core property messaging and amenities.
- R2: Visitor dashboard renders three non-empty chart visualizations.
- R3: Local account registration and login support admin access.
- R4: Local passwords are stored as bcrypt hashes, never plaintext.
- R5 [NEW v3]: Google OAuth 2.0 sign-in is available via Passport.
- R6 [NEW v3]: Account linking follows find-or-link-or-create policy.
- R7 [NEW v3]: Protected admin routes enforce authentication middleware.
- R8 [NEW v3]: Session cookie configuration uses httpOnly and sameSite, and secure in production.
- R9 [NEW v3]: Secret management uses .env and committed .env.example.

## 4. Technical Architecture

### Stack

- Frontend: React + Vite + Chart.js
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: Passport LocalStrategy + passport-google-oauth20
- Session Store: express-session + connect-mongo

### Request-Flow Diagram

```mermaid
flowchart LR
  Browser --> PublicRoutes[Public Routes / and /dashboard]
  Browser --> AuthRoutes[/login /register /auth/google]
  AuthRoutes --> Passport[Passport Strategies]
  Passport --> Session[express-session + connect-mongo]
  Session --> AdminRoutes[Protected /admin/*]
  PublicRoutes --> API[Express API]
  AdminRoutes --> API
  API --> DB[(MongoDB)]
```

## 5. Authentication and Security (Revised for HW15-B)

Answer each question in 1-3 sentences using your own project decisions.

### 5.1 Which authentication strategies will the application support?

- Local auth: email + bcrypt-hashed password using Passport LocalStrategy.
- OAuth auth: Google OAuth 2.0 using passport-google-oauth20.
- Justification for both strategies: [ADD YOUR JUSTIFICATION FOR YOUR TARGET SEGMENT].

### 5.2 What is the user data model?

Use and explain this schema-level contract:

- email (String, unique, indexed)
- displayName (String)
- password (String, nullable for OAuth-only users)
- googleId (String, unique sparse or indexed)
- provider (String: local or google)
- role (String, default user or admin)
- createdAt (Date, default now)

### 5.3 How is account linking handled?

Document your find-or-link-or-create rule exactly:

1. Match by googleId first.
2. Else match by verified email and attach googleId/provider.
3. Else create new user record.

### 5.4 How are sessions managed?

State your session policy:

- express-session with connect-mongo store.
- TTL: 14 days.
- Cookie attributes: httpOnly true, sameSite lax/strict per your decision, secure true in production.

### 5.5 How are secrets stored?

State your environment-variable policy and list variables:

- .env is git-ignored.
- .env.example is committed.
- dotenv loads at process start.
- Variables: MONGO_URI, SESSION_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PORT, [ADD ANY OTHERS].

### 5.6 Which routes are protected?

List every protected route and middleware (example names shown):

- GET /admin/dashboard -> ensureAuthenticated
- GET /admin/properties/new -> ensureAuthenticated
- POST /admin/properties -> ensureAuthenticated
- [ADD PROJECT-SPECIFIC ROUTES]

Unauthenticated redirect target: /login

### 5.7 What threats does the design mitigate?

Map at least three OWASP Top 10 (2021) categories to controls in your app:

- A01 Broken Access Control -> route guards, role checks, protected admin namespace.
- A02 Cryptographic Failures -> bcrypt password hashing, HTTPS in production, secure session cookie.
- A07 Identification and Authentication Failures -> Passport strategy validation, session expiration, generic login error handling.

## 6. Acceptance Criteria and Test Scripts [NEW v3]

### 6.1 Given-When-Then Acceptance Criteria

| ID | Feature Area | Given | When | Then |
|---|---|---|---|---|
| AC-1 | Public marketing page | Any visitor | GET / | HTTP 200 and page renders property name, hero image, and >= 3 amenities |
| AC-2 | Visitor dashboard | Any visitor | GET /dashboard | Three Chart.js visualizations render with non-empty data |
| AC-3 | Local sign-up | New email | POST /register with valid email and password >= 8 chars | HTTP 302 to /admin/dashboard, user document exists, password stored hashed |
| AC-4 | Local sign-in | Registered user | POST /login with correct credentials | HTTP 302 to /admin/dashboard and session cookie is set |
| AC-5 | Google OAuth sign-in | User with Google account | Click Sign in with Google and consent | HTTP 302 to /admin/dashboard, user has googleId and provider=google |
| AC-6 | Protected route guard | Unauthenticated visitor | GET /admin/dashboard | HTTP 302 redirect to /login and no admin content |
| AC-7 | Logout | Authenticated user | POST /logout | Session cleared and req.user undefined on next request |
| AC-8 | Secret hygiene | Deployed project | Inspect repository | .env absent, .env.example present, no keys committed |

### 6.2 Automated Test Scripts (Jest + Supertest)

Add at least one automated test for AC-3 through AC-7 in tests/auth.test.js.

Test mapping to include in your writeup:

- AC-3 -> test register flow and hashed password persistence
- AC-4 -> test login success and session cookie
- AC-5 -> test OAuth callback success path (mock strategy)
- AC-6 -> test protected route redirect
- AC-7 -> test logout session teardown

Embed screenshot of passing tests at:

- docs/screenshots/jest-auth-tests-green.png

## 7. AI Attribution

List editing tools only. Do not claim AI authored your requirements decisions.

- Tool: ChatGPT/GitHub Copilot
- Use: Grammar cleanup, heading formatting, table alignment
- Human-authored by: Bryceson Gaoiran (requirements, decisions, acceptance criteria)

---

## Submission Checklist

- [ ] PDF exported as PRD_v3_GaoiranBryceson.pdf (or instructor naming format)
- [ ] Editable source committed at week15/term-project/docs/
- [ ] Section 5 answers all seven required security/auth questions
- [ ] Section 6 includes >= 6 GWT criteria and >= 3 automated tests
- [ ] Green test screenshot embedded in PRD
- [ ] Cover label shows v3 - May 1, 2026
