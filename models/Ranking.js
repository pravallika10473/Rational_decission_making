const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  rankings: [{
    rank: String,
    item: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ranking', rankingSchema); 