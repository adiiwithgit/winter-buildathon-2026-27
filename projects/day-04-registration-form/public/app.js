const form = document.getElementById('regForm');
const msg = document.getElementById('msg');
const btn = document.getElementById('btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  msg.className = '';
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  const data = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await res.json();
    msg.textContent = out.message;
    msg.className = res.ok ? 'ok' : 'err';
    if (res.ok) form.reset();
  } catch {
    msg.textContent = 'Network error. Please try again.';
    msg.className = 'err';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Register';
  }
});