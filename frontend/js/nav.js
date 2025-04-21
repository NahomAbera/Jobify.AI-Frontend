// Handles active nav link highlighting
const current = window.location.pathname.split('/').pop();
document.querySelectorAll('.navlink').forEach((a) => {
  if (a.getAttribute('href') === current) {
    a.classList.add('navlink-active');
  }
});
