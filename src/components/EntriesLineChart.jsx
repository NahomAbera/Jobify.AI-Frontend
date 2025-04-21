import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EntriesLineChart({ dates = [], label = 'Entries', color = 'rgba(99, 102, 241, 1)' }) {
  // Aggregate counts per YYYY-MM-DD
  const counts = {};
  dates.forEach((d) => {
    if (!d) return;
    const key = new Date(d).toISOString().slice(0, 10);
    counts[key] = (counts[key] || 0) + 1;
  });
  const labels = Object.keys(counts).sort();
  const dataPoints = labels.map((l) => counts[l]);

  const data = {
    labels,
    datasets: [
      {
        label,
        data: dataPoints,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Line options={options} data={data} />;
}
