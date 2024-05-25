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
  const [tempo, setTempo] = useState(0);
  const [tempoClasse, setTempoClasse] = useState('');
  const [dataAtual, setDataAtual] = useState('');
  const [classeExterior, setClasseExterior] = useState('exterior card-GS dia'); // Dia ou Noite

  // API IPMA - Tipo de Tempo
  const fetchValues = async () => {
    try {
      const tempoAPI = await fetch('http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1141600.json'); // Santarém - 1141600
      const dataTempo = await tempoAPI.json();
      setTemperaturaMax(dataTempo.data[0].tMax);
      setTemperaturaMin(dataTempo.data[0].tMin);
      setPrecepitacao(dataTempo.data[0].precipitaProb);
      setVento(dataTempo.data[0].classWindSpeed);
      setTempo(dataTempo.data[0].idWeatherType);
      const dataOriginal = dataTempo.data[0].forecastDate;
      const [ano, mes, dia] = dataOriginal.split('-');
      const dataFormatada = `${dia}/${mes}/${ano}`;
      setDataAtual(dataFormatada);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  // Muda a classe de acordo com a hora dia/noite
  const dianoite = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour >= 19 || hour < 6) {
      setClasseExterior('exterior card-GS noite');
    } else {
      setClasseExterior('exterior card-GS dia');
    }
  };

  useEffect(() => {
    fetchValues(); // Fetch inicial
    const interval = setInterval(() => {
      fetchValues();
    }, 10000); // 10 Segundos
    return () => clearInterval(interval);
  }, []);

  // API IPMA - Wind Speed Daily Classe
  useEffect(() => {
    const fetchVentoClasse = async () => {
      try {
        const ventoAPI = await fetch('https://api.ipma.pt/open-data/wind-speed-daily-classe.json');
        const dataVento = await ventoAPI.json();
        setVentoClasse(dataVento.data[vento].descClassWindSpeedDailyPT);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchVentoClasse();
  }, [vento]); // Re-fetch ventoClasse quando o vento muda

  // API IPMA - Weather Type Classe
  useEffect(() => {
    const fetchTempoClasse = async () => {
      try {
        const tempoTipoAPI = await fetch('https://api.ipma.pt/open-data/weather-type-classe.json');
        const dataTempoTipo = await tempoTipoAPI.json();
        setTempoClasse(dataTempoTipo.data[tempo].descWeatherTypePT);
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    fetchTempoClasse();
  }, [tempo]); // Re-fetch ventoClasse quando o tempo muda

  useEffect(() => {
    dianoite(); // Muda a classe de acordo com a hora
  }, []);

  return (
    <>
      <div className={classeExterior}>
        <div className="card-GS-container dia">
          <div className="card-GS-container-text">
            <div className="card-GS-titulo">Exterior: <span>{dataAtual}</span></div>
            <h4 className="card-GS-temp">{temperaturaMax} ºC</h4>
            <div className="card-GS-temp-min">{temperaturaMin} ºC</div>
            <span className="card-GS-estado-tempo">{tempoClasse}</span>
            <div className='card-GS-info-container'>
              <div>
                <i className='card-GS-icon-info'><FontAwesomeIcon icon={faDroplet} /></i>
              </div>
              <div className='card-GS-info'>
                <span className="card-GS-info-valor">{precepitacao} %</span><br/>
                <div className="card-GS-info-titulo">Precipitação</div>
              </div>
              <div className='card-GS-icon-info-container'>
                <i className='card-GS-icon-info'><FontAwesomeIcon icon={faWind} /></i>
              </div>
              <div className='card-GS-info'>
                <span className="card-GS-info-valor">{ventoClasse}</span>
                <div className="card-GS-info-titulo">Vento</div>
              </div>
            </div>
          </div>
          {tempo === 4 || tempo === 5 || tempo === 16 || tempo === 17 ? (
            <div className='card-GS-img-container'>
              <img className='card-GS-img' src='./assets/images/ipma/nuvens.png'/>
            </div>
          ) : tempoClasse.includes("chuva") || tempoClasse.includes("rain") || tempoClasse.includes("Chuvisco") ? (
            <div className='card-GS-img-container'>
              <img className='card-GS-img' src='./assets/images/ipma/chuva.png'/>
            </div>
          ) : (
            <div className='card-GS-img-container'>
              {classeExterior === 'exterior card-GS noite' ? (
                <img className='card-GS-img dia' src='./assets/images/ipma/lua.png'/>
              ) : (
                <img className='card-GS-img dia' src='./assets/images/ipma/sol.png'/>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Ipma;
