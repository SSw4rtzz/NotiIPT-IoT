import React, { useState, useEffect } from 'react';


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureThreeQuarters, faDroplet, faLightbulb, faTemperatureArrowUp, faTemperatureArrowDown} from '@fortawesome/free-solid-svg-icons'; // Solid
import {faSun} from '@fortawesome/free-regular-svg-icons'; // Regular

function Gestao() {

    const [temperatura, setTemperatura] = useState(''); // Temperatura da sala
    const [temperaturaAnt, setTemperaturaAnt] = useState(''); // Temperatura da sala
    const [humidade, setHumidade] = useState(''); // Humidade da sala
    const [luminosidade, setLuminosidade] = useState(''); // Luminosidade da sala

    const fetchValues = async () => {
        try {
            const response = await fetch('https://66366efb415f4e1a5e275e9a.mockapi.io/dados'); // ! API de Testes, substituir pela API do Projeto
            const data = await response.json();

            // Obtém a temperatura atual e a anterior da API
            const temperaturaAtual = data[0].temperatura;
            const temperaturaAnterior = data[1].temperatura;

            // Calcula a diferença entre a temperatura atual e a anterior
            const diferencaTemperatura = temperaturaAtual - temperaturaAnterior;

            // Define a temperatura atual, a anterior e a diferença no estado
            setTemperatura(temperaturaAtual + 'ºC');
            setTemperaturaAnt(temperaturaAnterior + 'ºC');
            
            setHumidade(data[0].humidade + '%');
            setLuminosidade(data[0].luminosidade + '%');
        } catch (error) {
            console.error('Erro:', error);
        }
    };

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
                        <h4 className="card-GS-dados">{temperatura}</h4> {/* Mostra temperatura da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faTemperatureThreeQuarters} /></i>
                </div>
                <div className="card-GS-container-evolucao">
                    <div className='card-GS-evolucao tempPositivo'>
                        <FontAwesomeIcon icon={faTemperatureArrowUp}/>
                        5ºC
                        
                        <span className='card-GS-evolucao-text'>mais alto</span>
                    </div>
                </div> {/* Mostra a evolução da temperatura da sala */}
            </div>

            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Humidade</span>
                        <h4 className="card-GS-dados">{humidade}</h4> {/* Mostra luminosidade da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faDroplet} /></i>
                </div>
            </div>

            
            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Luminusidade</span>
                        <h4 className="card-GS-dados">{luminosidade}</h4> {/* Mostra estado da luz da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faSun} /></i>
                </div>
                <span className="card-GS-barra"></span> {/* TODO Barra de luminosidade */}
            </div>

            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Luz</span>
                        <h4 className="card-GS-dados">Ligada</h4> {/* Mostra estado da luz da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faLightbulb} /></i>
                </div>
                <span className="card-GS-btn">Acender</span>
            </div>
        </section>
        </div>
    );
}

export default Gestao;