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
import { Transaction } from '../types/transactions.type';
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
      radius: 0.8
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
  loading: boolean;
  transactions?: Transaction[];
}

const LineChart: FC<LineChartProps> = ({
  lineColor,
  loading,
  transactions
}) => {

  let data;

  if (transactions) {
    const venomTrxs= transactions.filter(t =>  t.token == 'Venom');

    data = {
      labels: venomTrxs.map((t) => new Date(t.blockTime).toLocaleDateString()),
      tension: 1,
      datasets: [
        {
          label: '',
          data: venomTrxs.map((t) => +t.amount  / (10 ** 9)),
          borderColor: lineColor,
          borderWidth: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        },

      ],
    };

  }


  return (
    <>
      {data && data.labels &&
        <Line options={options} data={data} color={lineColor} />
      }
    </>

  );
}


export default LineChart;