import express from 'express';
import Property from '../Property.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

router.use('/admin', isAuthenticated);

router.get('/admin/dashboard', async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();
    const totalReviews = properties.reduce(
      (sum, property) => sum + (Array.isArray(property.reviews) ? property.reviews.length : 0),
      0
    );

    const rows = properties
      .map(
        (property) => `<tr>
          <td>${escapeHtml(property.name)}</td>
          <td>${escapeHtml(property.island)}</td>
          <td>${escapeHtml(property.type)}</td>
          <td>${Array.isArray(property.reviews) ? property.reviews.length : 0}</td>
        </tr>`
      )
      .join('');

    res.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Dashboard | Maui Luxury Vacation Rentals</title>
    <style>
      body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f8fafc; color: #1f2937; }
      .wrap { max-width: 960px; margin: 28px auto; padding: 0 16px; }
      .card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: 0 8px 20px rgba(0,0,0,.08); }
      h1 { margin-top: 0; color: #0f766e; }
      .meta { margin: 8px 0 18px; color: #4b5563; }
      .logout { display: inline-block; margin-bottom: 14px; color: #0f766e; font-weight: 700; text-decoration: none; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; }
      th { background: #f0fdfa; color: #134e4a; }
      .chip { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #ecfeff; color: #155e75; font-weight: 700; }
      @media (max-width: 640px) { table { font-size: .9rem; } th, td { padding: 8px; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      <section class="card">
        <a class="logout" href="/admin/logout">Logout</a>
        <h1>Welcome to Maui Luxury Vacation Rentals Admin Dashboard</h1>
        <p class="meta"><strong>Logged in admin:</strong> ${escapeHtml(req.user?.email || 'Unknown')}</p>
        <p class="meta"><span class="chip">Properties: ${properties.length}</span> <span class="chip">Total guest reviews: ${totalReviews}</span></p>

        <table aria-label="Property list">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Island</th>
              <th>Type</th>
              <th>Reviews</th>
            </tr>
          </thead>
          <tbody>
            ${rows || '<tr><td colspan="4">No properties found.</td></tr>'}
          </tbody>
        </table>
      </section>
    </div>
  </body>
</html>`);
  } catch (error) {
    res.status(500).send(`Server error loading dashboard: ${escapeHtml(error.message)}`);
  }
});

export default router;
