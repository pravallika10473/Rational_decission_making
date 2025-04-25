const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const Ranking = require('./models/Ranking');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'build')));

// API endpoint to submit rankings
app.post('/api/rankings', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    const { username, rankings, timestamp } = req.body;
    
    // Validate username
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Invalid username format' });
    }
    
    // Validate rankings array
    if (!Array.isArray(rankings)) {
      return res.status(400).json({ error: 'Rankings must be an array' });
    }
    
    // Process and validate each ranking item
    const processedRankings = rankings.map(ranking => {
      // Convert rank to string if it's a number
      const rank = ranking.rank ? ranking.rank.toString() : null;
      const item = ranking.item ? ranking.item.toString() : null;
      
      if (!rank || !item) {
        throw new Error('Each ranking must have rank and item properties');
      }
      
      return { rank, item };
    });
    
    // Create new ranking document
    const newRanking = new Ranking({
      username: username.trim(),
      rankings: processedRankings,
      timestamp: timestamp || new Date()
    });
    
    // Save to database
    await newRanking.save();
    
    res.status(200).json({ message: 'Rankings submitted successfully' });
  } catch (error) {
    console.error('Error saving rankings:', error);
    res.status(500).json({ error: 'Failed to save rankings', details: error.message });
  }
});

// API endpoint to get rankings for a specific user
app.get('/api/rankings/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const rankings = await Ranking.find({ username: username.trim() })
      .sort({ timestamp: -1 });
    
    if (!rankings.length) {
      return res.status(404).json({ error: 'No rankings found for this user' });
    }
    
    res.status(200).json(rankings);
  } catch (error) {
    console.error('Error reading rankings:', error);
    res.status(500).json({ error: 'Failed to read rankings', details: error.message });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 