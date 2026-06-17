import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon = '🍽️', title, subtitle }) => (
  <div className="empty-state">
    <span className="empty-state-icon" role="img" aria-hidden="true">{icon}</span>
    <p className="empty-state-title">{title}</p>
    {subtitle && <p className="empty-state-subtitle">{subtitle}</p>}
  </div>
);

export default EmptyState;
