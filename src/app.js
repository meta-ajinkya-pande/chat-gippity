const express = require('express');

const { getAuthToken } = require('./auth');
const { processPrompt } = require('./process-prompt');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
let authToken;

async function init() {
  try {
    authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIyYTQ1OWRmOS1kOGUxLTQzZTAtOTk4ZS0zMjBhYmJlNTgxZDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEvIiwiaWF0IjoxNjkyODc5NDEzLCJuYmYiOjE2OTI4Nzk0MTMsImV4cCI6MTY5Mjg4MzYxMCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhVQUFBQUVUL2ZscTRuQU9EWEthSHRYVG41NUJXa3Qzd3IxQWk4TFNNRlM0TlRCNVZkM3VQT25qWkloek0rUmcvYThraWRQbXRaQ1daUXFoL1N4Zm5XczNtS05Cdm5xNnVxYkU0OXV3emdSdkphMHpjPSIsImFtciI6WyJwd2QiLCJyc2EiLCJtZmEiXSwiYXBwaWQiOiIyYTQ1OWRmOS1kOGUxLTQzZTAtOTk4ZS0zMjBhYmJlNTgxZDAiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6Ijk4ZmRhZTgwLWY3YTQtNDZlZC1iMDgzLWZiODhlOWE3ZTdhMyIsImZhbWlseV9uYW1lIjoiUGFuZGUiLCJnaXZlbl9uYW1lIjoiQWppbmt5YSIsImdyb3VwcyI6WyI0ZjEyMTNlNS1hMmE0LTQ1ZTAtOTI1ZS1hYjg3MjkxZGI1ODAiXSwiaXBhZGRyIjoiMjAuMjEyLjk5LjE1IiwibmFtZSI6IlBhbmRlLCBBamlua3lhIEVYMSIsIm9pZCI6ImE3MTBmNjU2LTA1N2ItNGQ3ZS1hYTgzLTFmYTQ4NTk3NDUyNCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMzc5ODE3NjQtMTcwOTc4Nzk4OC0yMzExNDU3NzEtNTkwOTgxOSIsInJoIjoiMC5BUWdBNE95SldRNzV2MENjZVJwNzdNMjRZZm1kUlNyaDJPQkRtWTR5Q3J2bGdkQUlBSGcuIiwic2NwIjoiR3JvdXAuUmVhZC5BbGwgR3JvdXBNZW1iZXIuUmVhZC5BbGwgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwiLCJzdWIiOiJqaHBzVWx2OTJIaEJvdUl5cHJpelZ5aGtKT0c0S3FBb2VQR2J3WGdneGZjIiwidGlkIjoiNTk4OWVjZTAtZjkwZS00MGJmLTljNzktMWE3YmVjY2RiODYxIiwidW5pcXVlX25hbWUiOiJBUGFuZGVAdXMuaW1zaGVhbHRoLmNvbSIsInVwbiI6IkFQYW5kZUB1cy5pbXNoZWFsdGguY29tIiwidXRpIjoiOWV2SEU4RkNZa0dTRnctZnB0WjNBQSIsInZlciI6IjEuMCJ9.ZJ_m-OglEVuik49fspie8_WcdPbAl2c89GPghoKuf7lMoUO7iA9ItCh-ucoNul0LDJFxYLz5_pIUPGAkr5AS7HI_ymLFrqB1VBEDSiOYB8CqHamaKmGay-5Ls2SBop7bJ47Po_PNhKkqrsqLoZkDnnPGw2zkRtYT1H1HY0A1dwL9pbqeAD7r7bsLFg-50imFWhdVFhPYFmz49lJu1I8jEW1BRR2PO_NP1P3y8zHoef9p3nNxWEBt_wf1Y888o2toynQJznXKL1TlIh5-FTLoCEnyBSrTOMxKUFjn23msggmbF5LRBRXEO2FZzq_EZ000UhILAkvYb6ZJBNhRqsobvg";
    console.log(authToken);
  } catch (err) {
    console.log(err);
  }
}

app.use((req, res, next) => {
  res.on('finish', function() {
    console.log(`${req.method} ${req.path} - ${res.statusCode} ${res.statusMessage}`);
  });
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST');
      return res.sendStatus(200);
  }
  next();
});

app.post('/process-prompt', async (req, res, next) => {
  try {
    const { input } = req.body;
    const promptResponse = await processPrompt(input, authToken);
    res.json(promptResponse);
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  const err = new Error('Page not found!');
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500)
    .json({
        status: error.status || 500,
        message: error.message
    });
});

app.listen(PORT, async () => {
  await init();
  console.log(`Server running on port ${PORT}`);
});
