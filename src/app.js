const express = require('express');

const { getAuthToken } = require('./auth');
const { processPrompt } = require('./process-prompt');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
let authToken;

async function init() {
  try {
    authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIyYTQ1OWRmOS1kOGUxLTQzZTAtOTk4ZS0zMjBhYmJlNTgxZDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEvIiwiaWF0IjoxNjkyODgzMTc3LCJuYmYiOjE2OTI4ODMxNzcsImV4cCI6MTY5Mjg4NzQ1MiwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhVQUFBQW5DeEQwQzdHZW40WElEK2F5c0hMeUo4Z1lvOWhINTdvbW1DYi9hbmVDbmpCL1NSQTUrdHlqa2I0T2pYdWs3ckxFM29KUmcxbHA1aC8rVnU5TUgwa1NZMlN1YVJPWk9jWEpuejczQlhSMEJBPSIsImFtciI6WyJwd2QiLCJyc2EiLCJtZmEiXSwiYXBwaWQiOiIyYTQ1OWRmOS1kOGUxLTQzZTAtOTk4ZS0zMjBhYmJlNTgxZDAiLCJhcHBpZGFjciI6IjAiLCJkZXZpY2VpZCI6Ijk4ZmRhZTgwLWY3YTQtNDZlZC1iMDgzLWZiODhlOWE3ZTdhMyIsImZhbWlseV9uYW1lIjoiUGFuZGUiLCJnaXZlbl9uYW1lIjoiQWppbmt5YSIsImdyb3VwcyI6WyI0ZjEyMTNlNS1hMmE0LTQ1ZTAtOTI1ZS1hYjg3MjkxZGI1ODAiXSwiaXBhZGRyIjoiMjAuMjEyLjk5LjYyIiwibmFtZSI6IlBhbmRlLCBBamlua3lhIEVYMSIsIm9pZCI6ImE3MTBmNjU2LTA1N2ItNGQ3ZS1hYTgzLTFmYTQ4NTk3NDUyNCIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS0xMzc5ODE3NjQtMTcwOTc4Nzk4OC0yMzExNDU3NzEtNTkwOTgxOSIsInJoIjoiMC5BUWdBNE95SldRNzV2MENjZVJwNzdNMjRZZm1kUlNyaDJPQkRtWTR5Q3J2bGdkQUlBSGcuIiwic2NwIjoiR3JvdXAuUmVhZC5BbGwgR3JvdXBNZW1iZXIuUmVhZC5BbGwgVXNlci5SZWFkIFVzZXIuUmVhZC5BbGwiLCJzdWIiOiJqaHBzVWx2OTJIaEJvdUl5cHJpelZ5aGtKT0c0S3FBb2VQR2J3WGdneGZjIiwidGlkIjoiNTk4OWVjZTAtZjkwZS00MGJmLTljNzktMWE3YmVjY2RiODYxIiwidW5pcXVlX25hbWUiOiJBUGFuZGVAdXMuaW1zaGVhbHRoLmNvbSIsInVwbiI6IkFQYW5kZUB1cy5pbXNoZWFsdGguY29tIiwidXRpIjoiYW91d3RZTGtya0dSV19ZOEphOW5BQSIsInZlciI6IjEuMCJ9.fx9v6YzQPhG6sW_3kwgTEmlkh8KnGYtiywdeQkMzZy0lYPsnjFB6W2yUMR_0ekcvj5dJebTQBacoZCQZ9AtBhCB3ArL8boJLmAjJwtoKMbBM2lW4W3ZCJZmMsx0xQ7Ac4TMkxUh1_7XRixZ1z52DHZel_PXVlGIquZuJ82nMZ_3M-kfq_Pxrbch3hvlIh3QAOUi7_hZTp1uz4EKoPHYXNfV0WCNOOFI5WJhU92yDkzueO_vSbwas8ZkzwRkhXsQqlJvNVxyA1ty_iH3AvQF0gITNwv4LvrAwdb7dIRsSQhr8MaJlaSSXZ7zO0UR4f4hOPMK0zo9W20e1jdZpEgmkMw";
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
