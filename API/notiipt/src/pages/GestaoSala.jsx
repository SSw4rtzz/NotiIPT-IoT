import React, { useState, useEffect } from 'react';


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet,
    faLightbulb,
    faTemperatureThreeQuarters, faTemperatureArrowUp, faTemperatureArrowDown,
    faArrowUp, faArrowDown,
    faGripLinesVertical
} from '@fortawesome/free-solid-svg-icons'; // Solid
import {faSun} from '@fortawesome/free-regular-svg-icons'; // Regular
import Ipma from '../components/ipma/ipma';

function Gestao() {
    const [temperatura, setTemperatura] = useState(''); // Temperatura da sala
    const [temperaturaAnterior, setTemperaturaAnterior] = useState(''); // Penúltima medida da temperatura da sala
    const [humidade, setHumidade] = useState(''); // Humidade da sala
    const [humidadeAnterior, setHumidadeAnterior] = useState(''); // Penúltima medida da humidade da sala
    const [luminosidade, setLuminosidade] = useState(''); // Luminosidade da sala
    const [luz, setLuz] = useState(''); // Estado da luz da sala


    const fetchValues = async () => {
        try {
            const response = await fetch('https://66366efb415f4e1a5e275e9a.mockapi.io/dados'); // ! API de Testes, substituir pela API do Projeto
            const data = await response.json();

            // Define a temperatura atual, a anterior e a diferença no estado
            setTemperatura(data[0].temperatura);
            setTemperaturaAnterior(data[1].temperatura);
            
            setHumidade(data[0].humidade);
            setHumidadeAnterior(data[1].humidade);

            setLuminosidade(data[0].luminosidade);

            setLuz(data[0].luz);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    let diferencaTemp = 0;
    let diferencaHum = 0;

    if(temperaturaAnterior !== '') {
        diferencaTemp = temperatura-temperaturaAnterior;
    }
    if(temperaturaAnterior !== '') {
        diferencaHum = humidade-humidadeAnterior;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            fetchValues();
        }, 10000); // 10 Segundos
        return () => clearInterval(interval);
    }, []);


    return (
        <div className='home'>
        <section className="titulo">
            <div className="text">Gestão da Sala</div>
        </section>

        <section className="grid-GS">
            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Temperatura</span>
                        <h4 className="card-GS-dados">{temperatura + 'ºC'}</h4> {/* Mostra temperatura da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faTemperatureThreeQuarters} /></i>
                </div>
                <div className="card-GS-container-evolucao">
                    { temperatura >= temperaturaAnterior ? (
                        <div className='card-GS-evolucao tempPositivo'>
                        <FontAwesomeIcon icon={faTemperatureArrowUp}/>
                        {diferencaTemp + 'ºC'}
                        </div>
                     ) : (
                        <div className='card-GS-evolucao tempNegativo'>
                        <FontAwesomeIcon icon={faTemperatureArrowDown}/>
                        {diferencaTemp + 'ºC'}
                        </div>
                    )}
                </div> {/* Mostra a evolução da temperatura da sala */}
            </div>

            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Humidade</span>
                        <h4 className="card-GS-dados">{humidade + '%'}</h4> {/* Mostra luminosidade da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faDroplet} /></i>
                </div>
                <div className="card-GS-container-evolucao">
                    { humidade >= humidadeAnterior ? (
                        <div className='card-GS-evolucao positivo'>
                        <FontAwesomeIcon icon={faArrowUp}/>
                        {diferencaHum + '%'}
                        </div>
                     ) : (
                        <div className='card-GS-evolucao negativo'>
                        <FontAwesomeIcon icon={faArrowDown}/>
                        {diferencaHum + '%'}
                        </div>
                    )}
                </div> {/* Mostra a evolução da temperatura da sala */}
            </div>
            
            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Luminusidade</span>
                        <h4 className="card-GS-dados">{luminosidade + '%'}</h4> {/* Mostra estado da luz da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faSun} /></i>
                </div>
                <div className="card-GS-container-evolucao">

                <i className="card-GS-lampada"><FontAwesomeIcon icon={faGripLinesVertical} /></i>

                    <div className="card-GS-barra">
                        
                        <div className="card-GS-barra-preenchida" style={{ width: `${luminosidade}%` }}>
                        </div>
                    </div> {/* TODO Barra de luminosidade */}
                </div>
            </div>
            {luz == 'true' ? (
            <div className='card-GS'>
                <div className="card-GS-container"> 
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Luz</span>
                        <h4 className="card-GS-dados">Acesa</h4> {/* Mostra estado da luz da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faLightbulb}  style={{color: "#F6F193"}} /></i>
                </div>
                <span className="card-GS-btn">Apagar</span>
                </div>
                ) : (
                <div className='card-GS'>
                    <div className="card-GS-container"> 
                        <div className="card-GS-container-text">
                            <span className="card-GS-titulo">Luz</span>
                            <h4 className="card-GS-dados">Apagada</h4> {/* Mostra estado da luz da sala */}
                        </div>
                        <i className='card-GS-icon'><FontAwesomeIcon icon={faLightbulb}/></i>
                    </div>
                    <span className="card-GS-btn">Acender</span>
                </div>
            )}
        </section>
        <section className="grid-GS">
            <Ipma />
        </section>
        </div>
    );
}

export default Gestao;