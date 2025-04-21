import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StatsChart({ counts }) {
  const labels = ['applications', 'interviews', 'offers', 'rejections'];
  const colors = [
    'rgba(99, 102, 241, 0.6)', // indigo
    'rgba(56, 189, 248, 0.6)', // sky
    'rgba(16, 185, 129, 0.6)', // emerald
    'rgba(244, 63, 94, 0.6)',  // rose
  ];

  const data = {
    labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        label: 'Count',
        data: labels.map((k) => counts[k] || 0),
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return <Bar options={options} data={data} />;
}
