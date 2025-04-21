import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function pad(n) {
  return n.toString().padStart(2, '0');
}

function isoWeek(d) {
  // Copy date so don't modify original
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday (current date + 4 - current day number)
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return weekNo;
}

function bucketKey(date, bucket) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  if (bucket === 'day') return `${yyyy}-${mm}-${dd}`;
  if (bucket === 'week') {
    const wk = pad(isoWeek(d));
    return `${yyyy}-W${wk}`;
  }
  if (bucket === 'month') return `${yyyy}-${mm}`;
  if (bucket === 'quarter') {
    const q = Math.floor((d.getMonth()) / 3) + 1; // 1-4
    return `${yyyy}-Q${q}`;
  }
  if (bucket === 'half') {
    const h = d.getMonth() < 6 ? 'H1' : 'H2';
    return `${yyyy}-${h}`;
  }
  if (bucket === 'year') return `${yyyy}`;
  return `${yyyy}-${mm}`; // month
}

export default function EntriesBarChart({ dates = [], rangeMs = 30 * 86400000, bucket: forcedBucket, label = 'Entries', color = 'rgba(99, 102, 241, 0.6)' }) {
  let bucket = forcedBucket;
  if (!bucket || bucket === 'auto') {
    bucket = rangeMs <= 7 * 86400000 ? 'day' : rangeMs <= 90 * 86400000 ? 'week' : 'month';
  }
  const counts = {};
  dates.forEach((d) => {
    if (!d) return;
    const key = bucketKey(d, bucket);
    counts[key] = (counts[key] || 0) + 1;
  });

  // Generate continuous labels between start and end of selected range
  const startDate = new Date(Date.now() - rangeMs);
  const endDate = new Date();

  function increment(date) {
    switch (bucket) {
      case 'day':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      case 'week':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
      case 'month':
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
      case 'quarter':
        return new Date(date.getFullYear(), date.getMonth() + 3, 1);
      case 'half':
        return new Date(date.getFullYear(), date.getMonth() + 6, 1);
      case 'year':
        return new Date(date.getFullYear() + 1, 0, 1);
      default:
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
  }

  // Align current to bucket start
  let current = new Date(startDate);
  if (bucket === 'week') {
    // move to Monday
    const day = current.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // 1 for Monday
    current.setDate(current.getDate() + diff);
  } else if (bucket === 'month') {
    current = new Date(current.getFullYear(), current.getMonth(), 1);
  } else if (bucket === 'quarter') {
    const qStartMonth = Math.floor(current.getMonth() / 3) * 3;
    current = new Date(current.getFullYear(), qStartMonth, 1);
  } else if (bucket === 'half') {
    const hStartMonth = current.getMonth() < 6 ? 0 : 6;
    current = new Date(current.getFullYear(), hStartMonth, 1);
  } else if (bucket === 'year') {
    current = new Date(current.getFullYear(), 0, 1);
  }

  const labels = [];
  while (current <= endDate) {
    labels.push(bucketKey(current, bucket));
    current = increment(current);
  }

  const dataPoints = labels.map((l) => counts[l] || 0);

  const data = {
    labels,
    datasets: [
      {
        label,
        data: dataPoints,
        backgroundColor: color,
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
        ticks: { precision: 0 },
      },
    },
  };

  return <Bar options={options} data={data} />;
}
