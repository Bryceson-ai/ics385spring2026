# Hero Project

Bryceson Gaoiran — 2026-02-03

Brief overview
--
This small Node.js example generates five pieces of content (a hero, a villain, an inspirational quote, a popular movie quote, and a famous last words entry) using npm packages, writes each to its own text file, and serves a combined snapshot over a simple HTTP server.

Quick start
-
1. Open a terminal in the `hero` folder.
2. Install dependencies:

```bash
cd hero
npm install
```

3. Run the app (this writes the five `.txt` files and starts an HTTP server on port 3000):

```bash
node index.js
```

Files and structure
-
- [hero/index.js](index.js) — Main script. Generates values, writes five individual `.txt` files, and starts a minimal HTTP server returning a plain-text snapshot.
- [hero/package.json](package.json) — Project manifest with dependencies.
- [hero/hero.txt](hero.txt) — Generated `Hero` name (created at runtime).
- [hero/villain.txt](villain.txt) — Generated `Villain` name (created at runtime).
- [hero/inspiration.txt](inspiration.txt) — Generated inspirational quote (created at runtime).
- [hero/movie-quote.txt](movie-quote.txt) — Generated popular movie quote (created at runtime).
- [hero/famous-last-words.txt](famous-last-words.txt) — Generated famous last words (created at runtime).
- [hero/file2.txt](file2.txt) — Combined snapshot written by the server on each request (created at runtime).

Dependencies used (selected)
-
- `superheroes` — random hero names
- `supervillains` — random villain names
- `inspirational-quotes` — inspirational quote generator
- `popular-movie-quotes` — movie quotes with helper API
- `famous-last-words` — array of humorous last words
- `lodash` — utility (`sample`) to pick random elements
- `dayjs` — small date formatter used for timestamps

Summary of changes made
-
1. `package.json` — Added dependencies: `lodash`, `dayjs`, `popular-movie-quotes`, and `famous-last-words` (in addition to the original packages).
2. `index.js` — Extended to:
   - require and use the two new packages for movie quotes and famous last words.
   - use `popular-movie-quotes.getRandomQuote()` to obtain a string quote.
   - pick `famous-last-words` via `lodash.sample`.
   - persist each generated value to its own `.txt` file: `hero.txt`, `villain.txt`, `inspiration.txt`, `movie-quote.txt`, and `famous-last-words.txt`.
   - continue to serve a combined plain-text snapshot over a tiny HTTP server at `http://127.0.0.1:3000/` and write that snapshot to `file2.txt`.
   - add detailed explanatory comments to clarify behavior, data sources, and file writes.
3. Installed node modules in the `hero` folder (run `npm install`).

Notes and next steps
-
- The script uses synchronous file writes for simplicity; in production prefer async APIs.
- If you want, I can: add a command in `package.json` to run the app, write a unit test, or stop the running server.
