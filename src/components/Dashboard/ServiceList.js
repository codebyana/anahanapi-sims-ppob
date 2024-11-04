// src/components/Dashboard/ServiceList.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ServiceList.css';

const services = [
  { name: 'PBB', icon: '/images/pbb_icon.png', path: '/pbb' },
  { name: 'Listrik', icon: '/images/bg_listrik.png', path: '/services/PLN' }, // Update path to /services/PLN
  { name: 'Pulsa', icon: '/images/bg_pulsa.png', path: '/pulsa' },
  { name: 'PDAM', icon: '/images/bg_pdam.png', path: '/pdam' },
  { name: 'PGN', icon: '/images/bg_pgn.png', path: '/pgn' },
  { name: 'TV Langganan', icon: '/images/Televisi.png', path: '/tv-langganan' },
  { name: 'Musik', icon: '/images/bg_musik.png', path: '/musik' },
  { name: 'Voucher Game', icon: '/images/game.png', path: '/voucher-game' },
  { name: 'Voucher Makanan', icon: '/images/Voucher_Makanan.png', path: '/voucher-makanan' },
  { name: 'Kurban', icon: '/images/bg_kurban.png', path: '/kurban' },
  { name: 'Zakat', icon: '/images/bg_zakat.png', path: '/zakat' },
  { name: 'Paket Data', icon: '/images/bg_paket.png', path: '/paket-data' },
];

const ServiceList = () => {
  return (
    <div className="service-list">
      {services.map((service, index) => (
        <Link to={service.path} key={index} className="service-item">
          <img src={service.icon} alt={service.name} className="service-icon" />
          <p className="service-name">{service.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default ServiceList;
