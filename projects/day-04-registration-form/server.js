const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));

// ---- Simple file storage ----
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'registrations.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

const readAll = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const saveAll = (list) => fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));

// ---- Routes ----
app.get('/health', (_req, res) => res.send('ok'));

app.post('/api/register', (req, res) => {
  const { name, email, phone, college, year, teamName } = req.body;
  const clean = (v) => (typeof v === 'string' ? v.trim() : '');

  const entry = {
    name: clean(name),
    email: clean(email).toLowerCase(),
    phone: clean(phone),
    college: clean(college),
    year: clean(year),
    teamName: clean(teamName),
  };

  if (entry.name.length < 2 || entry.name.length > 80)
    return res.status(400).json({ message: 'Enter a valid name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email))
    return res.status(400).json({ message: 'Invalid email.' });
  if (!/^[6-9]\d{9}$/.test(entry.phone))
    return res.status(400).json({ message: 'Enter a valid 10-digit Indian number.' });
  if (!entry.college)
    return res.status(400).json({ message: 'College is required.' });
  if (!['1', '2', '3', '4'].includes(entry.year))
    return res.status(400).json({ message: 'Select your year.' });

  const list = readAll();
  if (list.some((r) => r.email === entry.email))
    return res.status(409).json({ message: 'This email is already registered.' });

  list.push({ ...entry, createdAt: new Date().toISOString() });
  saveAll(list);
  res.status(201).json({ message: 'Registration successful!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));