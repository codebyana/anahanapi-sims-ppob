// src/components/PromoSlider.js
import React from 'react';
import './PromoSlider.css';

const promos = [
  { image: '/images/banner-1.png', color: '#FF5A5F' },
  { image: '/images/banner-2.png', color: '#FF9999' },
  { image: '/images/banner-3.png', color: '#99D6FF' },
  { image: '/images/banner-4.png', color: '#B3E5FC' },
  { image: '/images/banner-5.png', color: '#E1BEE7' },
];

const PromoSlider = () => {
  return (
    <div className="promo-slider">
      <h2>Temukan promo menarik</h2>
      <div className="promo-list">
        {promos.map((promo, index) => (
          <div key={index} className="promo-card" style={{ backgroundColor: promo.color }}>
            <img src={promo.image} alt={`Promo ${index + 1}`} className="promo-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;
