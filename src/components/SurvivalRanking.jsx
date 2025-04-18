import React, { useState } from 'react';
import './SurvivalRanking.css';

const SURVIVAL_ITEMS = [
  'A ball of steel wool',
  'A small axe',
  'A loaded pistol',
  'Can of vegetable oil',
  'Newspapers (one per person)',
  'Cigarette lighter (without fluid)',
  'Extra shirt and pants for each survivor',
  '20 x 20 ft. piece of heavy-duty canvas',
  'An air map made of plastic',
  'Some whiskey',
  'A compass',
  'Family-size chocolate bars (one per person)'
];

function SurvivalRanking() {
  const [rankings, setRankings] = useState(Array(12).fill(''));
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [username, setUsername] = useState('');

  const handleRankChange = (index, value) => {
    const newRankings = [...rankings];
    
    // If selecting a new item, clear any other position that had this item
    if (value) {
      const existingIndex = newRankings.indexOf(value);
      if (existingIndex !== -1 && existingIndex !== index) {
        newRankings[existingIndex] = '';
      }
    }
    
    newRankings[index] = value;
    setRankings(newRankings);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newRankings = [...rankings];
    [newRankings[draggedIndex], newRankings[targetIndex]] = 
    [newRankings[targetIndex], newRankings[draggedIndex]];
    setRankings(newRankings);
    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if all items are ranked and username is provided
    const isComplete = rankings.every(item => item !== '') && username.trim() !== '';
    if (!isComplete) {
      alert('Please rank all items and provide a username before submitting.');
      return;
    }

    // Format the rankings for submission
    const formattedRankings = rankings.map((item, index) => ({
      rank: (index + 1).toString(),
      item: item.toString()
    }));

    const submissionData = {
      username: username.trim(),
      rankings: formattedRankings,
      timestamp: new Date().toISOString()
    };

    console.log('Submitting data:', JSON.stringify(submissionData, null, 2));

    try {
      const response = await fetch('http://localhost:3001/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rankings');
      }

      const data = await response.json();
      console.log('Server response:', data);
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error details:', error);
      alert(`Failed to submit rankings: ${error.message}`);
    }
  };

  const getAvailableItems = (currentIndex) => {
    const currentSelection = rankings[currentIndex];
    return SURVIVAL_ITEMS.filter(item => 
      item === currentSelection || !rankings.includes(item)
    );
  };

  if (isSubmitted) {
    return (
      <div className="survival-ranking">
        <div className="submission-success">
          <h2>Thank You!</h2>
          <p>Your rankings have been submitted successfully.</p>
          <button 
            className="submit-button"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="survival-ranking">
      <h2>Rank the Survival Items</h2>
      <p className="instructions">
        Select items and drag to reorder. Click to select from dropdown.
      </p>
      <div className="username-input">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="ranking-container">
          {rankings.map((selectedItem, index) => (
            <div 
              key={index}
              className={`ranking-row ${draggedIndex === index ? 'dragging' : ''}`}
              draggable={!!selectedItem}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="ranking-item">
                <span className="rank-number">{index + 1}.</span>
                <select
                  value={selectedItem}
                  onChange={(e) => handleRankChange(index, e.target.value)}
                  className="item-select"
                  required
                >
                  <option value="">Select an item...</option>
                  {getAvailableItems(index).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {selectedItem && (
                  <span className="drag-handle">⋮⋮</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </form>
      <button 
        type="submit"
        className="submit-button"
        onClick={handleSubmit}
        disabled={!rankings.every(item => item !== '') || username.trim() === ''}
      >
        Submit Rankings
      </button>
    </div>
  );
}

export default SurvivalRanking; 