const form = document.getElementById('accessForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const params = new URLSearchParams();
  data.forEach((value, key) => params.append(key, value));
  const body = [...data]
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
    .join('\n');
  window.location.href = `mailto:nahomtesfahun001@gmail.com?subject=Jobify.AI%20Access%20Request&body=${encodeURIComponent(body)}`;
});
