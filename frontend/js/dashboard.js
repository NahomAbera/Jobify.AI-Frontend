import { supabase } from './supabaseClient.js';
import { requireAuth, initLogout } from './auth.js';

await requireAuth();
initLogout();

const countApplications = document.getElementById('countApplications');
const countInterviews = document.getElementById('countInterviews');
const countOffers = document.getElementById('countOffers');
const countRejections = document.getElementById('countRejections');

async function countRows(tbl) {
  const { count } = await supabase
    .from(tbl)
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

async function fetchCounts() {
  const [apps, interviews, offers, rejections] = await Promise.all([
    countRows('applications'),
    countRows('interviews'),
    countRows('offers'),
    countRows('rejections'),
  ]);

  countApplications.textContent = apps;
  countInterviews.textContent = interviews;
  countOffers.textContent = offers;
  countRejections.textContent = rejections;

  renderChart([apps, interviews, offers, rejections]);
}

let chart;
function renderChart(data) {
  const ctx = document.getElementById('statusChart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Applications', 'Interviews', 'Offers', 'Rejections'],
      datasets: [
        {
          data,
          backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#ef4444'],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'white',
          },
        },
      },
    },
  });
}

fetchCounts();
