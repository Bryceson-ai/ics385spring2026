/*
  NOTE: All comments in this file were AI-generated.
  They are intended to explain what each section does and why.
*/

//jshint esversion:6

// Load small helper libraries that provide random names/quotes.
// These are third-party packages (must be installed via npm).
const superheroes = require('superheroes');
const supervillains = require('supervillains');
const Quote = require('inspirational-quotes');
const _ = require('lodash');
const dayjs = require('dayjs');

// Generate one random hero, one random villain, and a random quote.
// These values are computed once when the script starts and reused
// for every HTTP response and the file write below.
var mySuperHeroName = superheroes.random();
var mySuperVillainName = supervillains.random();
var myQuote = Quote.getRandomQuote();

// Use npm packages for movie quotes and famous last words
const popularMovieQuotes = require('popular-movie-quotes');
const famousLastWords = require('famous-last-words');

// Choose random entries: call package API for movie quotes, sample array for last words
const myMovieQuote = popularMovieQuotes.getRandomQuote();
const myFamousLastWords = _.sample(famousLastWords);

// Print to the console so a developer running `node index.js` can see
// the generated values immediately in the terminal output.
console.log(mySuperHeroName);
console.log(mySuperVillainName);
console.log(myQuote);
console.log('Movie Quote:', myMovieQuote);
console.log('Famous Last Words:', myFamousLastWords);

// Creates a simple HTTP server that responds with the generated values.
// The server returns plain text and also writes the same content to
// a local file called `file2.txt` for persistence.
const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

// Build a response body for the HTTP response.
const responseBody = [
  `Super Hero: ${mySuperHeroName}`,
  `Super Villain: ${mySuperVillainName}`,
  `Inspiration: ${myQuote}`,
  `Movie Quote: ${myMovieQuote}`,
  `Famous Last Words: ${myFamousLastWords}`
].join('\n');

// Timestamp used at the top of each saved file
const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');

// Persist each item to its own .txt file
const writeItem = (filename, header, content) => {
  const body = `${header} - ${timestamp}\n\n${content}\n`;
  const fs = require('fs');
  fs.writeFileSync(filename, body);
};

writeItem('hero.txt', 'Hero', mySuperHeroName);
writeItem('villain.txt', 'Villain', mySuperVillainName);
writeItem('inspiration.txt', 'Inspiration Quote', myQuote);
writeItem('movie-quote.txt', 'Popular Movie Quote', myMovieQuote);
writeItem('famous-last-words.txt', 'Famous Last Words', myFamousLastWords);

const server = http.createServer((req, res) => {
  // Standard HTTP response setup: 200 OK and plain text content.
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  // Send the response body to the client.
  res.end(responseBody);

  // Persist the same response to `file2.txt`. This is synchronous by
  // design (fs.writeFileSync) to keep the example simple — in a real
  // server you might prefer the asynchronous API to avoid blocking.
  fs.writeFileSync('file2.txt', responseBody);
});

// Start listening on the configured host/port and log the access URL.
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
