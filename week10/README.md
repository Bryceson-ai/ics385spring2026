# Hawaii Hospitality Dashboard & Marketing Website

**Student:** Bryceson Gaoiran
**Course:** ICS 385 — Spring 2026  
**Week:** 10 — Term Project Setup

---

## Project Details

| Field | Value |
|---|---|
| **Project Title** | Maui Luxury Vacation Rentals Dashboard |
| **Chosen Island** | Maui |
| **Property Type** | Vacation Rental (Airbnb-style) |
| **Target Visitor Segment** | Canadian vacationers escaping winter and seeking affordable, local Airbnb experiences across Maui |

---

## Description

This full-stack web dashboard showcases Airbnb-style vacation rentals on the island of Maui, Hawai'i. The site is designed to attract Canadian vacationers looking for authentic, affordable local stays — highlighting cozy cottages, bungalows, and guesthouses in areas like Kihei, Paia, Lahaina, Haiku, and Napili.

The application uses a Node.js / Express backend, a MongoDB (Atlas) database via Mongoose, and a dynamic frontend that pulls live property listings from a RESTful API.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas via Mongoose
- **Frontend:** HTML / CSS / JavaScript (fetch API)
- **Environment Config:** dotenv

---

## Getting Started

1. Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database:
   ```bash
   node scripts/seed.js
   ```
4. Start the server:
   ```bash
   node server.js
   ```
