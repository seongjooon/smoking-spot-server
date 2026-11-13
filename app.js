require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDb = require('./lib/db');
const indexRouter = require('./routes/index');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const origins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false }));

// 요청마다 DB 연결(캐시됨)을 보장한다. health 는 DB 없이 응답.
app.use(async (req, res, next) => {
  if (req.path === '/health') return next();
  try {
    await connectDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/', indexRouter);

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: 'Internal Server Error' });
});

module.exports = app;
