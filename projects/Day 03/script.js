const form = document.getElementById('login');
const email = document.getElementById('email');
const password = document.getElementById('password');
const toggle = document.getElementById('toggle');
const submit = document.getElementById('submit');
const status = document.getElementById('status');

const rules = {
  email: v => !v ? 'Enter your email address.'
    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email, like you@college.edu.' : '',
  password: v => !v ? 'Enter your password.'
    : v.length < 8 ? 'Password must be at least 8 characters.' : ''
};

function check(input) {
  const msg = rules[input.id](input.value.trim());
  input.closest('.field').classList.toggle('invalid', !!msg);
  document.getElementById(input.id + '-err').textContent = msg;
  input.setAttribute('aria-invalid', !!msg);
  return !msg;
}

[email, password].forEach(i => {
  i.addEventListener('blur', () => check(i));
  i.addEventListener('input', () => i.closest('.field').classList.contains('invalid') && check(i));
});

toggle.addEventListener('click', () => {
  const show = password.type === 'password';
  password.type = show ? 'text' : 'password';
  toggle.textContent = show ? 'Hide' : 'Show';
  toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  status.className = 'status';
  status.textContent = '';
  const ok = [check(email), check(password)].every(Boolean);
  if (!ok) { (document.querySelector('.invalid input')).focus(); return; }

  submit.disabled = true;
  submit.textContent = 'Signing in…';
  await new Promise(r => setTimeout(r, 1200)); // TODO: replace with real fetch('/api/login')
  submit.disabled = false;
  submit.textContent = 'Sign in';
  status.className = 'status ok';
  status.textContent = 'Signed in (demo). Connect your backend next.';
});

document.getElementById('google').addEventListener('click', () => {
  status.className = 'status';
  status.textContent = 'Google sign-in needs a backend or OAuth setup.';
});
