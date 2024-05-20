import React, { useState, useEffect } from 'react';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faDroplet } from '@fortawesome/free-solid-svg-icons';

const Ipma = () => {
  const [temperaturaMax, setTemperaturaMax] = useState('');
  const [temperaturaMin, setTemperaturaMin] = useState('');
  const [precepitacao, setPrecepitacao] = useState('');
  const [vento, setVento] = useState(0);
  const [ventoClasse, setVentoClasse] = useState(''); // Muito Fraco, Fraco, Moderado, Forte, Muito Forte

  const fetchValues = async () => {
    try {
      const tempoAPI = await fetch('http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1141600.json'); // Santarém - 1141600
      const dataTempo = await tempoAPI.json();

      // Define a temperatura atual, a anterior e a diferença no estado
      setTemperaturaMax(dataTempo.data[0].tMax);
      setTemperaturaMin(dataTempo.data[0].tMin);
      setPrecepitacao(dataTempo.data[0].precipitaProb);
      setVento(dataTempo.data[0].classWindSpeed);

    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const fetchVentoClasse = async () => {
    try {
      const ventoAPI = await fetch('https://api.ipma.pt/open-data/wind-speed-daily-classe.json'); // Santarém - 1141600
      const dataVento = await ventoAPI.json();

      setVentoClasse(dataVento.data[vento].descClassWindSpeedDailyPT);

    } catch (error) {
      console.error('Erro:', error);
    }
  };

  useEffect(() => {
    fetchValues(); // Fetch initial data
    const interval = setInterval(() => {
      fetchValues();
    }, 10000); // 10 Segundos
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchVentoClasse();
  }, [vento]); // Re-fetch ventoClasse whenever vento changes

  return (
    <>
      <div className='exterior card-GS dia'>
        <div className="card-GS-container dia">
          <div className="card-GS-container-text">
            <span className="card-GS-titulo">Exterior</span>
            <h4 className="card-GS-temp dia">{temperaturaMax} ºC</h4>
            <div className="card-GS-temp-min">{temperaturaMin} ºC</div>
            <span className="card-GS-estado-tempo">Limpo</span>
            <div className='card-GS-info'>
              <div>
                <i className='card-GS-icon-info'><FontAwesomeIcon icon={faDroplet} /></i>
              </div>
              <div>
                <span className="card-GS-info-valor">{precepitacao} %</span><br/>
                <div className="card-GS-info-titulo">Precipitação</div>
              </div>
              <div className='card-GS-icon-info-container'>
                <i className='card-GS-icon-info'><FontAwesomeIcon icon={faWind} /></i>
              </div>
              <div>
                <span className="card-GS-info-valor">{ventoClasse}</span>
                <div className="card-GS-info-titulo">Vento</div>
              </div>
            </div>
          </div>
          <i className='card-GS-icon dia'>
            <img src='/src/assets/images/ipma/sol.png' alt='Weather Icon'/>
          </i>
        </div>
      </div>
    </>
  );
}

export default Ipma;
