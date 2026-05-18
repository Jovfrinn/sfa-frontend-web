// src/components/BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({monthlyData}) => {

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Visit',
        data: monthlyData,
        backgroundColor: 'rgba(2, 98, 224, 0.81)'
      ,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        // text: ''
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
