import React from 'react';
import './SurveyModal.css';

function SurveyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeZr6hSDJXdfbnNQ2omeMYLd0SpLwABU3BYUK0mpEzuILdcBQ/viewform?embedded=true"
          width="100%"
          height="550"
          title="Survey Form"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}

export default SurveyModal;
