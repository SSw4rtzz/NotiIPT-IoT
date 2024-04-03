import React from 'react';
import './side-adminbar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>NotiIPT - Admin</h2>
      <ul>
        <li>
          <Link to="/teste">Teste</Link>
        </li>
        <li>
          <Link to="/">Lorem</Link>
        </li>
        <li>
          <Link>Ispu</Link>
        </li>
        <li>
          <Link>Yesii</Link>
        </li>
      </ul>
      </nav>
  );
}

export default Sidebar;
