const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 12;

// In-memory user store for this standalone assignment exercise.
const users = [];
let nextUserId = 1;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
	session({
		secret: process.env.SESSION_SECRET || "week14b-passport-demo-secret",
		resave: false,
		saveUninitialized: false,
		cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 },
	}),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
	new LocalStrategy(
		{
			usernameField: "identifier",
			passwordField: "password",
		},
		async (identifier, password, done) => {
			try {
				const user = users.find(
					(entry) =>
						entry.username.toLowerCase() === identifier.toLowerCase() ||
						entry.email.toLowerCase() === identifier.toLowerCase(),
				);

				if (!user) {
					return done(null, false, { message: "No account found for that username/email." });
				}

				const passwordMatches = await bcrypt.compare(password, user.passwordHash);
				if (!passwordMatches) {
					return done(null, false, { message: "Incorrect password." });
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		},
	),
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	const user = users.find((entry) => entry.id === id);
	done(null, user || false);
});

function escapeHtml(value = "") {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function renderLayout(title, body) {
	return `
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>${escapeHtml(title)}</title>
			<style>
				body { font-family: Arial, sans-serif; margin: 0; background: #f4f6f8; color: #1f2937; }
				main { max-width: 760px; margin: 32px auto; background: #fff; padding: 24px; border-radius: 10px; box-shadow: 0 10px 24px rgba(0,0,0,0.08); }
				h1 { margin-top: 0; }
				nav { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
				a, button { font: inherit; }
				a { color: #0f766e; text-decoration: none; font-weight: 600; }
				a:hover { text-decoration: underline; }
				form { display: grid; gap: 12px; }
				label { display: grid; gap: 6px; font-weight: 600; }
				input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; }
				button { padding: 10px 14px; border: none; border-radius: 8px; background: #0f766e; color: #fff; cursor: pointer; width: fit-content; }
				button:hover { background: #0d615a; }
				.inline-form { display: inline; }
				.error { color: #b91c1c; background: #fee2e2; padding: 10px; border-radius: 8px; }
				.success { color: #166534; background: #dcfce7; padding: 10px; border-radius: 8px; }
				code { background: #eef2f7; padding: 2px 6px; border-radius: 6px; }
			</style>
		</head>
		<body>
			<main>${body}</main>
		</body>
	</html>
	`;
}

function nav(isAuthenticated) {
	return `
		<nav>
			<a href="/">Home</a>
			${isAuthenticated ? "<a href=\"/dashboard\">Dashboard</a>" : "<a href=\"/login\">Login</a>"}
			${isAuthenticated ? "" : "<a href=\"/register\">Register</a>"}
			${
				isAuthenticated
					? "<form class=\"inline-form\" method=\"POST\" action=\"/logout\"><button type=\"submit\">Logout</button></form>"
					: ""
			}
		</nav>
	`;
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	return res.redirect("/login?error=Please+log+in+first");
}

app.get("/", (req, res) => {
	const message = req.query.message
		? `<p class="success">${escapeHtml(req.query.message)}</p>`
		: "";

	res.send(
		renderLayout(
			"Week14b Passport Authentication Demo",
			`
			${nav(req.isAuthenticated())}
			<h1>Week14b: Passport Local Authentication Demo</h1>
			${message}
			<p>This standalone app demonstrates <strong>username-and-email login</strong> with <strong>Passport.js LocalStrategy</strong>, <strong>bcrypt password hashing</strong>, session-based auth, and route protection.</p>
			<p>Use <a href="/register">Register</a> to create an account, then sign in via either your username or your email on <a href="/login">Login</a>.</p>
			`,
		),
	);
});

app.get("/register", (req, res) => {
	const error = req.query.error ? `<p class="error">${escapeHtml(req.query.error)}</p>` : "";

	res.send(
		renderLayout(
			"Register",
			`
			${nav(req.isAuthenticated())}
			<h1>Create Account</h1>
			${error}
			<form method="POST" action="/register">
				<label>Username
					<input type="text" name="username" required minlength="3" />
				</label>
				<label>Email
					<input type="email" name="email" required />
				</label>
				<label>Password
					<input type="password" name="password" required minlength="8" />
				</label>
				<label>Confirm Password
					<input type="password" name="confirmPassword" required minlength="8" />
				</label>
				<button type="submit">Register</button>
			</form>
			`,
		),
	);
});

app.post("/register", async (req, res) => {
	try {
		const username = (req.body.username || "").trim();
		const email = (req.body.email || "").trim();
		const password = req.body.password || "";
		const confirmPassword = req.body.confirmPassword || "";

		if (!username || !email || !password) {
			return res.redirect("/register?error=All+fields+are+required");
		}

		if (password !== confirmPassword) {
			return res.redirect("/register?error=Passwords+do+not+match");
		}

		const usernameTaken = users.some(
			(entry) => entry.username.toLowerCase() === username.toLowerCase(),
		);
		if (usernameTaken) {
			return res.redirect("/register?error=Username+already+in+use");
		}

		const emailTaken = users.some((entry) => entry.email.toLowerCase() === email.toLowerCase());
		if (emailTaken) {
			return res.redirect("/register?error=Email+already+in+use");
		}

		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
		const user = {
			id: nextUserId,
			username,
			email,
			passwordHash,
			createdAt: new Date().toISOString(),
		};

		nextUserId += 1;
		users.push(user);

		req.login(user, (error) => {
			if (error) {
				return res.redirect("/login?error=Account+created+but+auto-login+failed");
			}
			return res.redirect("/dashboard");
		});
	} catch (error) {
		res.redirect("/register?error=Unexpected+server+error");
	}
});

app.get("/login", (req, res) => {
	const error = req.query.error ? `<p class="error">${escapeHtml(req.query.error)}</p>` : "";
	const success = req.query.message
		? `<p class="success">${escapeHtml(req.query.message)}</p>`
		: "";

	res.send(
		renderLayout(
			"Login",
			`
			${nav(req.isAuthenticated())}
			<h1>Login</h1>
			${error}
			${success}
			<form method="POST" action="/login">
				<label>Username or Email
					<input type="text" name="identifier" required />
				</label>
				<label>Password
					<input type="password" name="password" required />
				</label>
				<button type="submit">Login</button>
			</form>
			`,
		),
	);
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/login?error=Invalid+credentials",
	}),
);

app.get("/dashboard", ensureAuthenticated, (req, res) => {
	const publicUser = {
		id: req.user.id,
		username: req.user.username,
		email: req.user.email,
		createdAt: req.user.createdAt,
	};

	res.send(
		renderLayout(
			"Dashboard",
			`
			${nav(req.isAuthenticated())}
			<h1>Protected Dashboard</h1>
			<p>You are authenticated via Passport session. Only logged-in users can see this page.</p>
			<p><strong>Logged in as:</strong> ${escapeHtml(req.user.username)} (${escapeHtml(req.user.email)})</p>
			<p>Session-safe user payload:</p>
			<pre><code>${escapeHtml(JSON.stringify(publicUser, null, 2))}</code></pre>
			`,
		),
	);
});

app.post("/logout", (req, res, next) => {
	req.logout((error) => {
		if (error) {
			return next(error);
		}

		req.session.destroy(() => {
			res.clearCookie("connect.sid");
			res.redirect("/login?message=Logged+out+successfully");
		});
	});
});

app.get("/api/users", (req, res) => {
	// Helper endpoint for demonstration/testing; excludes password hashes.
	const safeUsers = users.map(({ id, username, email, createdAt }) => ({
		id,
		username,
		email,
		createdAt,
	}));
	res.json(safeUsers);
});

app.listen(PORT, () => {
	console.log(`Week14b Passport demo running at http://localhost:${PORT}`);
});
