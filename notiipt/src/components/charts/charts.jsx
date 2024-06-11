import { width } from '@fortawesome/free-brands-svg-icons/fa42Group';
import { colors } from '@mui/material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class Charts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            seriesArea: [{
                name: 'Temperatura de Hoje',
                data: [] // Inicialmente vazio, será preenchido com os dados da API
            }, {
                name: 'Temperatura de Ontem',
                data: [] // Inicialmente vazio, será preenchido com os dados da API
            }],
            optionsArea: {
                chart: {
                    type: 'area',
                    height: 350,
                    width: '100%',
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: [], // Inicialmente vazio, será preenchido com os dados da API
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            },
            seriesRadial: [70, 30], // [Energia Mês Atual, Energia Mês Passado]
            optionsRadial: {
                chart: {
                    type: 'radialBar',
                    height: 350,
                },
                plotOptions: {
                    radialBar: {
                        dataLabels: {
                            name: {
                                fontSize: '22px',
                            },
                            value: {
                                fontSize: '16px',
                            },
                            total: {
                                show: true,
                                label: 'Tempo de luz',
                                formatter: function () {
                                    return 'Acesa';
                                }
                            }
                        },
                        hollow: {
                            size: '70%',
                        },
                    }
                },
                labels: ['Mês Atual', 'Mês Passado'],
            },
        };
    }

    componentDidMount() {
        this.fetchApiData();
    }

    fetchApiData = async () => {
        try {
            const response = await fetch('https://572f-194-210-240-64.ngrok-free.app/api/dados');
            const data = await response.json();

            const hoje = [];
            const ontem = [];
            const categorias = [];
            let luzLigadaContagemAtual = 0;
            let totalMesAtual = 0;
            let luzLigadaContagemPassado = 0;
            let totalMesPassado = 0;

            const agora = new Date();
            const mesAtual = agora.getMonth();
            const mesPassado = new Date(agora.getFullYear(), agora.getMonth() - 1);

            data.forEach((item, index) => {
                const dataHora = new Date(item.dataHora);
                const diaAtual = agora.getDate();
                const diaDoItem = dataHora.getDate();
                const mesDoItem = dataHora.getMonth();
                const anoDoItem = dataHora.getFullYear();
                
                if (diaDoItem === diaAtual) {
                    hoje.push(item.temperatura);
                } else if (diaDoItem === diaAtual - 1) {
                    ontem.push(item.temperatura);
                }

                // Contagem para o mês atual
                if (anoDoItem === agora.getFullYear() && mesDoItem === mesAtual) {
                    totalMesAtual++;
                    if (item.luz === "ligada") {
                        luzLigadaContagemAtual++;
                    }
                }

                // Contagem para o mês passado
                if (anoDoItem === mesPassado.getFullYear() && mesDoItem === mesPassado.getMonth()) {
                    totalMesPassado++;
                    if (item.luz === "ligada") {
                        luzLigadaContagemPassado++;
                    }
                }

                if (index === 0) {
                    categorias.push(item.dataHora);
                }

            });

            const percentagemLuzLigadaAtual = (luzLigadaContagemAtual / totalMesAtual) * 100;
            const percentagemLuzLigadaPassado = (luzLigadaContagemPassado / totalMesPassado) * 100;

            this.setState({
                seriesArea: [
                    {
                        name: 'Temperatura de Hoje',
                        data: hoje
                    },
                    {
                        name: 'Temperatura de Ontem',
                        data: ontem
                    }
                ],
                optionsArea: {
                    ...this.state.optionsArea,
                    xaxis: {
                        ...this.state.optionsArea.xaxis,
                        categories: categorias
                    }
                },
                seriesRadial: [percentagemLuzLigadaAtual, percentagemLuzLigadaPassado], // [Energia Mês Atual, Energia Mês Passado]
                optionsRadial: {
                    ...this.state.optionsRadial,
                    plotOptions: {
                        ...this.state.optionsRadial.plotOptions,
                        radialBar: {
                            ...this.state.optionsRadial.plotOptions.radialBar,
                            dataLabels: {
                                ...this.state.optionsRadial.plotOptions.radialBar.dataLabels,
                                total: {
                                    ...this.state.optionsRadial.plotOptions.radialBar.dataLabels.total,
                                    formatter: function () {
                                        return luzLigadaContagemAtual > 0 ? 'Acesa' : 'Apagada';
                                    }
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao procurar dados da API:', error);
        }
    };

    render() {
        return (
            <>
                <div className='chart card-GS'>
                    <div className="card-GS-container">
                        <div id="chart1" style={{ width: '100%' }}>
                            <ReactApexChart options={this.state.optionsArea} series={this.state.seriesArea} type="area" height={350} />
                        </div>
                    </div>
                </div>
                <div className='chart card-GS'>
                    <div className="card-GS-container">
                        <div id="chart2" style={{ width: '100%' }}>
                            <ReactApexChart options={this.state.optionsRadial} series={this.state.seriesRadial} type="radialBar" height={350} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Charts;
