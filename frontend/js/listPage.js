import { supabase } from './supabaseClient.js';
import { requireAuth, initLogout } from './auth.js';

export async function initListPage({
  table,
  dateField,
  columns, // [{label:'Company', field:'company_name'}]
}) {
  await requireAuth();
  initLogout();

  const limitSelect = document.getElementById('limitSelect');
  const timeSelect = document.getElementById('timeSelect');
  const tbody = document.getElementById('tableBody');
  const canvas = document.getElementById('progressChart');

  let chart;

  async function update() {
    const limit = parseInt(limitSelect.value, 10);
    const days = parseInt(timeSelect.value, 10);
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .gte(dateField, sinceDate.toISOString())
      .order(dateField, { ascending: false })
      .limit(limit);

    if (error) {
      console.error(error);
      return;
    }

    renderTable(data);
    renderChart(data);
  }

  function renderTable(rows) {
    tbody.innerHTML = '';
    rows.forEach((row) => {
      const tr = document.createElement('tr');
      columns.forEach((col) => {
        const td = document.createElement('td');
        td.className = 'px-4 py-2';
        let value = row[col.field] ?? '';
        if (col.field === dateField) {
          value = new Date(value).toLocaleDateString();
        }
        td.textContent = value;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }

  function renderChart(rows) {
    // Count by date (yyyy-mm-dd)
    const counts = {};
    rows.forEach((row) => {
      const d = new Date(row[dateField]).toISOString().substring(0, 10);
      counts[d] = (counts[d] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const data = labels.map((d) => counts[d]);

    if (chart) chart.destroy();
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        scales: {
          x: { ticks: { color: 'white' } },
          y: { ticks: { color: 'white' } },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  limitSelect.addEventListener('change', update);
  timeSelect.addEventListener('change', update);

  update();
}
