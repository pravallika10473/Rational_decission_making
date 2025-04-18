import React from 'react';

function MessageFormatter({ content }) {
  const formatContent = (text) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if this is the list section
      if (paragraph.includes('1. A ball of steel wool')) {
        const [header, ...items] = paragraph.split('\n');
        return (
          <React.Fragment key={index}>
            <p>{header}</p>
            <ol>
              {items.map((item, i) => {
                const cleanItem = item.replace(/^\d+\.\s*/, '');
                return <li key={i}>{cleanItem}</li>;
              })}
            </ol>
          </React.Fragment>
        );
      }
      return <p key={index}>{paragraph}</p>;
    });
  };

  return <div className="formatted-message">{formatContent(content)}</div>;
}

export default MessageFormatter;
