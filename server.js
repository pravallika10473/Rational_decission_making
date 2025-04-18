const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'build')));

// Store rankings in a JSON file
const rankingsFile = path.join(__dirname, 'rankings.json');

// Ensure the rankings file exists
if (!fs.existsSync(rankingsFile)) {
  fs.writeFileSync(rankingsFile, JSON.stringify([]));
}

// API endpoint to submit rankings
app.post('/api/rankings', (req, res) => {
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
    
    // Read existing rankings
    const existingRankings = JSON.parse(fs.readFileSync(rankingsFile));
    
    // Add new ranking
    existingRankings.push({
      username: username.trim(),
      rankings: processedRankings,
      timestamp: timestamp || new Date().toISOString()
    });
    
    // Save back to file
    fs.writeFileSync(rankingsFile, JSON.stringify(existingRankings, null, 2));
    
    res.status(200).json({ message: 'Rankings submitted successfully' });
  } catch (error) {
    console.error('Error saving rankings:', error);
    res.status(500).json({ error: 'Failed to save rankings', details: error.message });
  }
});

// API endpoint to get all rankings
app.get('/api/rankings', (req, res) => {
  try {
    const rankings = JSON.parse(fs.readFileSync(rankingsFile));
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