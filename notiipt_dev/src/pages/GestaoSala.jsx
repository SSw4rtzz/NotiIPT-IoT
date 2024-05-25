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
        const username = 'user1';  // Substitua pelo seu nome de usuário
        const password = 'user1';  // Substitua pela sua senha
        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(`${username}:${password}`));
        try {
            const response = await fetch('http://localhost:3000/api/dados', { headers: headers }); // ! API de Testes, substituir por http://api:3000/api/dados
            const data = await response.json();

            console.log('Dados recebidos:', data);

            // Define a temperatura atual, a anterior e a diferença no estado
            setTemperatura(data.temperatura);
            //! setTemperaturaAnterior(data[1].temperatura); DEPENDE da BASE DE DADOS
            
            setHumidade(data.humidade);
            //! setHumidadeAnterior(data[1].humidade); DEPENDE da BASE DE DADOS

            setLuminosidade(data.ldr);

            setLuz(data.led);
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
        }, 1000); // 1 Segundos
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
                            <h4 className="card-GS-dados">{luz}</h4> {/* Mostra estado da luz da sala */}
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