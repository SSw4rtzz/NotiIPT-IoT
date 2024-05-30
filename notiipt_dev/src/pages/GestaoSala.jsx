import React, { useState, useEffect } from 'react';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDroplet,
    faLightbulb,
    faTemperatureThreeQuarters,
    faTemperatureArrowUp,
    faTemperatureArrowDown,
    faArrowUp,
    faArrowDown,
    faGripLinesVertical
} from '@fortawesome/free-solid-svg-icons'; // Solid
import { faSun } from '@fortawesome/free-regular-svg-icons'; // Regular
import Ipma from '../components/ipma/ipma';
import Charts from '../components/charts/charts';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

function Gestao() {
    const [temperatura, setTemperatura] = useState(''); // Temperatura da sala
    const [temperaturaAnterior, setTemperaturaAnterior] = useState(''); // Penúltima medida da temperatura da sala
    const [humidade, setHumidade] = useState(''); // Humidade da sala
    const [humidadeAnterior, setHumidadeAnterior] = useState(''); // Penúltima medida da humidade da sala
    const [luminosidade, setLuminosidade] = useState(''); // Luminosidade da sala
    const [luz, setLuz] = useState(''); // Estado da luz da sala

    const [luzState, setLuzState] = useState('');
    const [autoMode, setAutoMode] = useState(true); //! Modo automático inicialmente ativado Mudar isto

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            console.log('Conectado ao servidor WebSocket');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Dados recebidos via WebSocket:', data);

            // Atualiza o estado com os novos dados
            setTemperatura(data.temperatura);
            setHumidade(data.humidade);
            setLuminosidade(data.ldr);
            setLuz(data.luz);

            // ! setTemperaturaAnterior(data[1].temperatura); DEPENDE da BASE DE DADOS
            // ! setHumidadeAnterior(data[1].humidade); DEPENDE da BASE DE DADOS
        };

        ws.onclose = () => {
            console.log('Desconectado do servidor WebSocket');
        };

        ws.onerror = (error) => {
            console.error('Erro no WebSocket:', error);
        };

        // Limpeza na desmontagem do componente
        return () => {
            ws.close();
        };
    }, []);

    const handleControl = async (state, autoMode) => {
        const username = 'user1'; // !!!!!!!!!
        const password = 'user1';
        const headers = new Headers();
        headers.set('Authorization', 'Basic ' + btoa(`${username}:${password}`));
        headers.set('Content-Type', 'application/json');
        try {
            const response = await fetch(`http://localhost:3000/api/control`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ luzState: state, autoMode: autoMode })
            });
            const result = await response.text();
            console.log(result);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleLuzControl = (state) => {
        if (!autoMode) {
            setLuzState(state);
            handleControl(state, autoMode);
        }
    };

    const handleAutoModeToggle = () => {
        const newAutoMode = !autoMode;
        setAutoMode(newAutoMode);
        handleControl(luzState, newAutoMode);
    };

    let diferencaTemp = 0;
    let diferencaHum = 0;

    if (temperaturaAnterior !== '') {
        diferencaTemp = temperatura - temperaturaAnterior;
    }
    if (humidadeAnterior !== '') {
        diferencaHum = humidade - humidadeAnterior;
    }


    // Switch 
    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
      ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)', // Adiciona a transição aqui
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#BACD92;',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[600],
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 22,
          height: 22,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
        },
      }));

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
                        {temperatura >= temperaturaAnterior ? (
                            <div className='card-GS-evolucao tempPositivo'>
                                <FontAwesomeIcon icon={faTemperatureArrowUp} />
                                {diferencaTemp + 'ºC'}
                            </div>
                        ) : (
                            <div className='card-GS-evolucao tempNegativo'>
                                <FontAwesomeIcon icon={faTemperatureArrowDown} />
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
                        {humidade >= humidadeAnterior ? (
                            <div className='card-GS-evolucao positivo'>
                                <FontAwesomeIcon icon={faArrowUp} />
                                {diferencaHum + '%'}
                            </div>
                        ) : (
                            <div className='card-GS-evolucao negativo'>
                                <FontAwesomeIcon icon={faArrowDown} />
                                {diferencaHum + '%'}
                            </div>
                        )}
                    </div> {/* Mostra a evolução da temperatura da sala */}
                </div>

                <div className='card-GS'>
                    <div className="card-GS-container">
                        <div className="card-GS-container-text">
                            <span className="card-GS-titulo">Luminosidade</span>
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
                {luz === 'Ligada' ? (
                    <div className='card-GS'>
                        <div className="card-GS-container">
                            <div className="card-GS-container-text">
                                <span className="card-GS-titulo">Luz</span>
                                <h4 className="card-GS-dados">Ligada</h4> {/* Mostra estado da luz da sala */}
                            </div>
                            <i className='card-GS-icon'><FontAwesomeIcon icon={faLightbulb} style={{ color: "#ffd42b" }} /></i>
                        </div>
                        <button className="card-GS-btn" onClick={() => handleLuzControl('desligar')} disabled={autoMode}>Desligar</button>
                    </div>
                ) : (
                    <div className='card-GS'>
                        <div className="card-GS-container">
                            <div className="card-GS-container-text">
                                <span className="card-GS-titulo">Luz</span>
                                {luz === 'ligar' ? (
                                    <h4 className="card-GS-dados">A ligar</h4>
                                ) : luz === 'desligar' ?(
                                    <h4 className="card-GS-dados-light">A desligar</h4>
                                ) : (
                                    <h4 className="card-GS-dados">Desligada</h4>
                                )}
                            </div>
                            <i className='card-GS-icon'><FontAwesomeIcon icon={faLightbulb} /></i>
                        </div>

                        <button className="card-GS-btn" onClick={() => handleLuzControl('ligar')} disabled={autoMode}>Ligar</button>
                    </div>
                )}
            </section>

            <h4 className='titulo-switch'>Modo Automático</h4>

            <FormControlLabel
                sx={{ m: 0 }}
                control={<IOSSwitch sx={{ m: 1 }} checked={autoMode} onChange={handleAutoModeToggle} />}
            />
            <div className='estado-switch'> {`${autoMode ? 'Ativo' : 'Desligado'}`}</div>


            <section className="grid-GS">
                <Charts />
            </section>
            <section className="grid-GS">
                <Ipma />
            </section>
        </div>
    );
}

export default Gestao;
