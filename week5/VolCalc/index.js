const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));

// Helpful default route
app.get("/", (req, res) => {
  res.redirect("/VolCalc");
});

// Serve the HTML form
app.get("/VolCalc", (req, res) => {
  res.sendFile(path.join(__dirname, "VolCalculator.html"));
});
app.get("/VolCalc/", (req, res) => {
  res.sendFile(path.join(__dirname, "VolCalculator.html"));
});

// Handle GET submissions for radius/height input
app.get("/VolCalc/result", (req, res) => {
  const r = parseFloat(req.query.radius);
  const h = parseFloat(req.query.height);
  if (isNaN(r) || isNaN(h)) {
    return res.send(`
      <html>
        <head><title>Volume Cylinder - GET Error</title></head>
        <body>
          <h1>Invalid GET input</h1>
          <p>Please provide numeric values for radius and height.</p>
          <p><a href="/VolCalc">Back</a></p>
        </body>
      </html>
    `);
  }

  res.send(`
    <html>
      <head><title>Volume Cylinder - GET</title></head>
      <body>
        <h1>Volume Cylinder (GET)</h1>
        <p>Radius received: ${r}</p>
        <p>Height received: ${h}</p>
        <p><a href="/VolCalc">Back</a></p>
      </body>
    </html>
  `);
});

// Handle POST calculation
app.post("/VolCalc", (req, res) => {
  const r = parseFloat(req.body.radius);
  const h = parseFloat(req.body.height);
  if (isNaN(r) || isNaN(h)) {
    return res.send(`
      <html>
        <head><title>Volume Cylinder - Error</title></head>
        <body>
          <h1>Invalid input</h1>
          <p>Please provide numeric values for radius and height.</p>
          <p><a href="/VolCalc">Back</a></p>
        </body>
      </html>
    `);
  }

  const volume = Math.PI * Math.pow(r, 2) * h;
  const formatted = volume.toFixed(2);

  res.send(`
    <html>
      <head>
        <title>Volume Cylinder - Result</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; background: #f5f7fb; }
          .card { max-width: 460px; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
          .result { font-size: 26px; font-weight: 700; margin: 14px 0; color: #0b5394; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Volume Cylinder Result</h1>
          <p>Radius: ${r}</p>
          <p>Height: ${h}</p>
          <p class="result">Volume = ${formatted} cubic units</p>
          <p><a href="/VolCalc">Calculate again</a></p>
        </div>
      </body>
    </html>
  `);
});

const basePort = Number(process.env.PORT) || 3000;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use, trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }
    throw err;
  });
}

startServer(basePort);

