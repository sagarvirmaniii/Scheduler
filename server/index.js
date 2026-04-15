require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// ✅ FINAL CORS CONFIG (LOCAL + VERCEL)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://scheduler-frontend-ecru-two.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ✅ ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/eventTypes'));
app.use('/api/availability', require('./routes/availability'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/slots', require('./routes/slots'));

// ✅ HEALTH CHECK
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// ✅ ROOT
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// ✅ DB TEST (BigInt FIXED)
app.get('/test-db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as value`;

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

// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));