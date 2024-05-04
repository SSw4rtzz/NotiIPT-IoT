import React from 'react';


// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureThreeQuarters, faDroplet, faLightbulb} from '@fortawesome/free-solid-svg-icons'; // Solid
import {faSun} from '@fortawesome/free-regular-svg-icons'; // Regular

function Gestao() {
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
                        <h4 className="card-GS-dados">25ºC</h4> {/* Mostra temperatura da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faTemperatureThreeQuarters} /></i>
                </div>
            </div>

            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Humidade</span>
                        <h4 className="card-GS-dados">50%</h4> {/* Mostra luminosidade da sala */}
                    </div>
                    <i className='card-GS-icon'><FontAwesomeIcon icon={faDroplet} /></i>
                </div>
            </div>

            
            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Luminusidade</span>
                        <h4 className="card-GS-dados">50%</h4> {/* Mostra estado da luz da sala */}
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