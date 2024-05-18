import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faDroplet } from '@fortawesome/free-solid-svg-icons';


const Ipma = () => {

  return (
    <>
      <div className='exterior card-GS dia'>
        <div className="card-GS-container dia">
            <div className="card-GS-container-text">
                <span className="card-GS-titulo">Exterior</span>
                <h4 className="card-GS-temp dia">20ºC</h4>
                <span className="card-GS-estado-tempo">Limpo</span>
                <div className='card-GS-info'>
                  <div>
                    <i className='card-GS-icon-info'><FontAwesomeIcon icon={faDroplet} /></i>
                  </div>
                  <div>
                    <span className="card-GS-info-valor">100%</span><br/>
                    <div className="card-GS-info-titulo">Precipitação</div>
                  </div>
                  <div className='card-GS-icon-info-container'>
                    <i className='card-GS-icon-info'><FontAwesomeIcon icon={faWind} /></i>
                  </div>
                  <div>
                    <span className="card-GS-info-valor">2 Km/h</span>
                    <div className="card-GS-info-titulo">Vento</div>
                  </div>
                </div>
            </div>
            <i className='card-GS-icon dia'>
              <img src='/src/assets/images/ipma/sol.png'/>
            </i>
        </div>
        
    </div>
    </>      
  );
}

export default Ipma;
