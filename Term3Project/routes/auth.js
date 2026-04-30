import express from 'express';
import passport from '../passport-config.js';

const router = express.Router();

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderLoginPage(error = '') {
  const errorMarkup = error
    ? `<p class="error" role="alert">${escapeHtml(error)}</p>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Login | Maui Luxury Vacation Rentals</title>
    <style>
      :root { --teal: #0f766e; --tealDark: #115e59; --bg: #f3f7f8; --text: #1f2937; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: var(--bg); color: var(--text); }
      .wrap { min-height: 100vh; display: grid; place-items: center; padding: 18px; }
      .card { width: 100%; max-width: 420px; background: white; border-radius: 14px; padding: 22px; box-shadow: 0 10px 25px rgba(0,0,0,.10); }
      .brand { text-align: center; margin-bottom: 14px; }
      .brand img { width: 100%; max-height: 120px; object-fit: cover; border-radius: 10px; margin-bottom: 10px; }
      .brand h1 { margin: 0; font-size: 1.3rem; color: var(--tealDark); }
      .brand p { margin: 6px 0 0; color: #4b5563; }
      .error { margin: 12px 0; padding: 10px; border-radius: 8px; background: #fee2e2; color: #b91c1c; }
      form { display: grid; gap: 12px; }
      label { font-weight: 600; display: grid; gap: 6px; }
      input { width: 100%; padding: 11px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; }
      button { border: none; border-radius: 8px; padding: 11px 14px; background: var(--teal); color: white; font-weight: 700; cursor: pointer; }
      button:hover { background: var(--tealDark); }
      .note { margin-top: 12px; font-size: .92rem; color: #4b5563; text-align: center; }
      @media (max-width: 375px) { .card { padding: 16px; } .brand h1 { font-size: 1.1rem; } }
    </style>
  </head>
  <body>
    <div class="wrap">
      <section class="card" aria-labelledby="login-heading">
        <div class="brand">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop" alt="Maui beachfront" />
          <h1 id="login-heading">Maui Luxury Vacation Rentals</h1>
          <p>Admin Login</p>
        </div>
        ${errorMarkup}
        <form method="POST" action="/admin/login" novalidate>
          <label for="email">Email address</label>
          <input id="email" name="email" type="email" placeholder="admin@example.com" required autocomplete="email" />

          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" required autocomplete="current-password" />

          <button type="submit">Sign In</button>
        </form>
        <p class="note">Authorized admins only.</p>
      </section>
    </div>
  </body>
</html>`;
}

router.get('/admin/login', (req, res) => {
  const error = req.query.error ? 'Invalid credentials. Please try again.' : '';
  res.status(200).send(renderLoginPage(error));
});

router.post('/admin/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login?error=1',
  })(req, res, next);
});

router.get('/admin/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/admin/login');
    });
  });
});

export default router;
