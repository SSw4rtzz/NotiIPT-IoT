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
                data: [22, 25, 23, 24, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20]
                }, {
                name: 'Temperatura de Ontem',
                data: [21, 24, 22, 23, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 28, 27, 26, 25, 24, 23, 22, 21, 20, 22]
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
                    categories: ['2021-09-01T00:00:00', '2021-09-01T01:30:00', '2021-09-01T02:30:00', '2021-09-01T03:30:00', '2021-09-01T04:30:00', '2021-09-01T05:30:00', '2021-09-01T06:30:00', '2021-09-01T07:30:00', '2021-09-01T08:30:00', '2021-09-01T09:30:00', '2021-09-01T10:30:00', '2021-09-01T11:30:00', '2021-09-01T12:30:00', '2021-09-01T13:30:00', '2021-09-01T14:30:00', '2021-09-01T15:30:00', '2021-09-01T16:30:00', '2021-09-01T17:30:00', '2021-09-01T18:30:00', '2021-09-01T19:30:00', '2021-09-01T20:30:00', '2021-09-01T21:30:00', '2021-09-01T22:30:00', '2021-09-01T23:30:00'],
                },
                tooltip: {
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
            },
            seriesRadial: [70, 30], // [Energia, Energia Mês Passado]
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
                                label: 'Luz',
                                formatter: function () {
                                    return 'Acesa'
                                }
                            }
                        },
                        hollow: {
                            size: '70%',
                        },
                    }
                },
                labels: ['Energia','Energia Mês Passado'],
            },
        };
    }

    render() {
        return (
            <>
                <div className='chart card-GS'>
                    <div className="card-GS-container">
                        <div id="chart1" style={{width: '100%'}}>
                            <ReactApexChart options={this.state.optionsArea} series={this.state.seriesArea} type="area" height={350}/>
                        </div>
                    </div>
                </div>
                <div className='chart card-GS'>
                    <div className="card-GS-container">
                        <div id="chart2" style={{width: '100%'}}>
                            <ReactApexChart options={this.state.optionsRadial} series={this.state.seriesRadial} type="radialBar" height={350} />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Charts;
