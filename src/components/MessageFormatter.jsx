import React from 'react';

function MessageFormatter({ content }) {
  // Convert numbered lists to proper HTML ordered lists
  const formatContent = (text) => {
    // Split text into paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if paragraph is a numbered list
      if (paragraph.match(/^\d+\./m)) {
        const items = paragraph.split('\n').filter(item => item.trim());
        return (
          <ol key={index}>
            {items.map((item, i) => {
              const cleanItem = item.replace(/^\d+\.\s*/, '');
              return <li key={i}>{cleanItem}</li>;
            })}
          </ol>
        );
      }
      return <p key={index}>{paragraph}</p>;
    });
  };

  return <div className="formatted-message">{formatContent(content)}</div>;
}

export default MessageFormatter;
