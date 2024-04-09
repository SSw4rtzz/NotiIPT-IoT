import React, { useEffect } from 'react';
import './side-adminbar.css';

import imagemPerfil from '@/assets/images/profile/perfil.jpg';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHouse, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


const Sidebar = () => {

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
          <FontAwesomeIcon icon={faChevronRight} />
        </i>
      </header>

      <div className="menu-bar">
        <div className="menu">

          <ul className="menu-links">
            <li className="nav-link active">
              <a href="#">
               <i className='icon'><FontAwesomeIcon icon={faHouse} /></i>
                <span className="text nav-text">Inicio</span>
              </a>
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
    
    <section className="home">
        <div className="text">NotiIPT - Admin</div>
      </section>
      </>      
  );
}

export default Sidebar;
