import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatsPie({ counts }) {
  const labels = ['Applications', 'Interviews', 'Offers', 'Rejections'];
  const colors = [
    'rgba(99, 102, 241, 0.6)', // indigo
    'rgba(56, 189, 248, 0.6)', // sky
    'rgba(16, 185, 129, 0.6)', // emerald
    'rgba(244, 63, 94, 0.6)',  // rose
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Count',
        data: [counts.applications, counts.interviews, counts.offers, counts.rejections],
        backgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return <Pie data={data} options={options} />;
}
