import { supabase } from './supabaseClient.js';

const form = document.getElementById('loginForm');
const errorEl = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  const email = form.email.value;
  const password = form.password.value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    errorEl.textContent = error.message;
  } else {
    window.location.href = 'dashboard.html';
  }
});
