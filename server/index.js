const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initialData = {
  state: {
    platforms: [],
    interviews: []
  },
  version: 0
};

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/store', (req, res) => {
  try {
    if (!fs.existsSync(DB_FILE)) {
        return res.json(initialData);
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Read error:', error);
    res.status(500).json({ error: 'Failed to read database' });
  }
});

app.post('/api/store', (req, res) => {
  try {
    const newData = req.body;
    // Basic validation could go here
    fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Write error:', error);
    res.status(500).json({ error: 'Failed to write database' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database file: ${DB_FILE}`);
});
