// src/components/StatsCard.jsx
import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, loading, isLabel = false, onClick }) => {
  return (
    <div className={`stats-card ${isLabel ? 'label-card' : ''}`} onClick={onClick} >
    {loading ? (
      <>
        <h3>{title}</h3>
        <div className="stats-loader"></div>
      </>
  ) : (
    <h3>
      {title}{" "}
      <span className={`stats-value ${isLabel ? 'label-value' : ''}`}>
        {value}
      </span>
    </h3>
  )}
</div>
  );
};

export default StatsCard;