import React, { FC, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import BtcData from '../../assets/btcdata.json';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  elements: {
    point: {
      radius: 0
    }
  },
  scales: {
    ['x']: {
      grid: {
        display: false,
      }
    }
    ,
    ['y']: {
      grid: {
        display: false,
      }
    }


  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false
    },
  },
};





interface LineChartProps {
  lineColor: string;
}

const LineChart: FC<LineChartProps> = ({
  lineColor
}) => {


  const data = {
    labels: BtcData.map((t) => ''),
    tension: 1,
    datasets: [
      {
        label: '',
        data: BtcData.map((t) => t[1]),
        borderColor: lineColor,
        borderWidth: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      },
  
    ],
  };
  
  return <Line options={options} data={data} color={lineColor}/>;
}


export default LineChart;