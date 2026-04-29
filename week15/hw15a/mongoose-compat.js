let mongoose;

try {
  mongoose = require('mongoose');
} catch (error) {
  // Some local npm/node combinations may omit mongoose top-level entry files.
  mongoose = require('mongoose/lib/index.js');
}

module.exports = mongoose;
