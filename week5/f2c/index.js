/* Author: Bryceson Gaoiran 
Date: 02/10/2026 
Overview: Convert Fahrenheit to Centigrade
*/

const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));

// Serve the HTML page for GET /f2c
app.get("/f2c", (req, res) => {
  const { fahrenheit, centigrade } = req.query;

  // If user provided fahrenheit but no centigrade, compute and redirect with centigrade
  if (typeof fahrenheit !== "undefined" && typeof centigrade === "undefined") {
    const f = parseInt(fahrenheit, 10);
    if (Number.isNaN(f)) {
      return res.redirect("/f2c");
    }
    const c = Math.round(((f - 32) * 5) / 9);
    return res.redirect(
      `/f2c?fahrenheit=${encodeURIComponent(f)}&centigrade=${encodeURIComponent(
        c
      )}`
    );
  }

  // Serve the static HTML file (the client script will read query params if present)
  res.sendFile(path.join(__dirname, "f2cCalc.html"));
});

// Handle conversion via POST /f2c
app.post("/f2c", (req, res) => {
  const raw = req.body.fahrenheit;
  const f = parseInt(raw, 10);
  if (Number.isNaN(f)) {
    // invalid input: redirect back without params
    return res.redirect("/f2c");
  }
  const c = Math.round(((f - 32) * 5) / 9);
  // Redirect to GET with results so the static page can display them
  res.redirect(
    `/f2c?fahrenheit=${encodeURIComponent(f)}&centigrade=${encodeURIComponent(
      c
    )}`
  );
});

// Serve everything else from this folder if needed
app.use(express.static(__dirname));

app.listen(port, () => console.log(`F2C Converter running on port ${port}`));
