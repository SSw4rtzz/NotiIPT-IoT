import React from 'react';

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
                    <div className="card-GS-icon"></div> {/* TODO */}
                </div>
            </div>

            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Luminosidade</span>
                        <h4 className="card-GS-dados">50%</h4> {/* Mostra luminosidade da sala */}
                    </div>
                    <div className="card-GS-icon"></div> {/* TODO */}
                </div>
            </div>

            
            <div className='card-GS'>
                <div className="card-GS-container">
                    <div className="card-GS-container-text">
                        <span className="card-GS-titulo">Luz</span>
                        <h4 className="card-GS-dados">Ligada</h4> {/* Mostra estado da luz da sala */}
                    </div>
                    <div className="card-GS-icon"></div> {/* TODO */}
                </div>
                <span className="card-GS-barra"></span> {/* TODO Barra de luminosidade */}
            </div>

        </section>
        </div>
    );
}

export default Gestao;