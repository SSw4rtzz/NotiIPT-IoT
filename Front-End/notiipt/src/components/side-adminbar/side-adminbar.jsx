import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './side-adminbar.css';

import imagemPerfil from '@/assets/images/profile/perfil.jpg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse, faSliders, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


const Sidebar = () => {

  const location = useLocation();

  // Esconde e mostra o menu
  useEffect(() => {
    const toggle = document.querySelector(".toggle");
    const toggleClickHandler = () => {
      const sidebar = document.querySelector('nav');
      sidebar.classList.toggle("fechada");
    };
    if (toggle) {
      toggle.addEventListener("click", toggleClickHandler);
    }
    return () => {
      if (toggle) {
        toggle.removeEventListener("click", toggleClickHandler);
      }
    };
  }, []);

  return (
    <><nav className="sidebar fechada">
      <header>
        <div className="imagem-menu">
          <span className="imagemPerfil">
          <img src={imagemPerfil} alt="Perfil" />
          </span>
          <div className="text perfil-text">
            <span className="nome">Admin</span>
            <span className="funcao">Admin Menu</span>
          </div>
        </div>
  
        <i className='toggle'>
          <span className='togleIcon'>
          <FontAwesomeIcon icon={faChevronRight} />
          </span>
        </i>
      </header>

      <div className="menu-bar">
        <div className="menu">

          <ul className="menu-links">
            <li className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              <Link to="/">
               <i className='icon'><FontAwesomeIcon icon={faHouse} /></i>
                <span className="text nav-text">Inicio</span>
              </Link>
            </li>

            <li className="nav-link">
              <a href="#">
                <i className='icon'></i>
                <span className="text nav-text">Teste</span>
              </a>
            </li>

            <li className="nav-link">
              <a href="#">
                <i className='icon'></i>
                <span className="text nav-text">Lorem</span>
              </a>
            </li>

            <li className="nav-link">
              <i className='icon'></i>
              <a href="#">
                <span className="text nav-text">Yesii</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="bottom-content">
        <li className={`nav-link ${location.pathname === '/gestaosala' ? 'active' : ''}`}>
            <Link to="/gestaosala">
            <i className='icon'>
              <FontAwesomeIcon icon={faSliders} />
            </i>
              <span className="text nav-text">Gestão da Sala</span>
            </Link>
          </li>
          <li className="">
            <a href="#">
            <i className='icon'>
              <FontAwesomeIcon icon={faRightFromBracket} />
            </i>
              <span className="text nav-text">Sair</span>
            </a>
          </li>
        </div>
      </div>
    </nav>
    </>      
  );
}

export default Sidebar;
