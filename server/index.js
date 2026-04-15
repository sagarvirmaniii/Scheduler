require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); // ✅ added

const app = express();
const prisma = new PrismaClient(); // ✅ added

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/eventTypes'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/slots', require('./routes/slots'));

// ✅ Health route
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// ✅ Root route (no more "Cannot GET /")
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// ✅ DB Test route (BigInt fix included)
app.get('/test-db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as value`;

    // ✅ convert BigInt safely
    const safeResult = result.map(row => ({
      ...row,
      value: Number(row.value)
    }));

    res.json({
      success: true,
      result: safeResult
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));