const express = require('express');
const path = require('path');

const { getAuthToken } = require('./auth');
const { processPrompt } = require('./process-prompt');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
let authToken;
let messages = [];

async function init() {
  try {
    authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIyYTQ1OWRmOS1kOGUxLTQzZTAtOTk4ZS0zMjBhYmJlNTgxZDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEvIiwiaWF0IjoxNjkyOTc2Njg2LCJuYmYiOjE2OTI5NzY2ODYsImV4cCI6MTY5Mjk4MTYwNywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhVQUFBQVpSVS9lakVFSkNaMG8zazZLNE54ZUJiVHBGY0ppVHpuMFR0amZKbkRjRzltZk1tNWhhNExtNzFjbWM2UTM5TEciLCJhbXIiOlsicHdkIiwicnNhIl0sImFwcGlkIjoiMmE0NTlkZjktZDhlMS00M2UwLTk5OGUtMzIwYWJiZTU4MWQwIiwiYXBwaWRhY3IiOiIwIiwiZGV2aWNlaWQiOiI5OGZkYWU4MC1mN2E0LTQ2ZWQtYjA4My1mYjg4ZTlhN2U3YTMiLCJmYW1pbHlfbmFtZSI6IktoaWNoaSIsImdpdmVuX25hbWUiOiJBa2FzaCIsImdyb3VwcyI6WyI0ZjEyMTNlNS1hMmE0LTQ1ZTAtOTI1ZS1hYjg3MjkxZGI1ODAiXSwiaXBhZGRyIjoiMjAuMjEyLjk5LjYyIiwibmFtZSI6IktoaWNoaSwgQWthc2ggRVgxIiwib2lkIjoiMTU0NDk4YWEtYjFmZi00ZDFhLWJiMjktNWVkNjc4YzBmNWRiIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEzNzk4MTc2NC0xNzA5Nzg3OTg4LTIzMTE0NTc3MS02MTA2NzA0IiwicmgiOiIwLkFRZ0E0T3lKV1E3NXYwQ2NlUnA3N00yNFlmbWRSU3JoMk9CRG1ZNHlDcnZsZ2RBSUFEMC4iLCJzY3AiOiJHcm91cC5SZWFkLkFsbCBHcm91cE1lbWJlci5SZWFkLkFsbCBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCIsInN1YiI6Imd1eUJhU1pUWVJKNjRJcG1nRVhON1dXRGx4Skp0b0VLMDNwQjN1Rl9UNXciLCJ0aWQiOiI1OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEiLCJ1bmlxdWVfbmFtZSI6ImFrYXNoLmtoaWNoaUBpcXZpYS5jb20iLCJ1cG4iOiJha2FzaC5raGljaGlAaXF2aWEuY29tIiwidXRpIjoiWEVDYlMxWVE0VUNsRXVjcFhzS0xBQSIsInZlciI6IjEuMCJ9.fhCxy7dcEbs9yJEqPU5cwPOntznli5J549XP7s7A-0v-LeqScB2zR3SpBqMt-uEUVyib6o5BlDBqfBcuShIU5tLDe2MVWDCNO8A3ohaQn_Hltytn7OeY5MUOxPv2AVLT2ZK-dDoRwvtw7wsWEuJlRzFELYVDI1CNpBjuzjdJVc0W1P9sOihkQTI2hskv6j2NiByB1Jie73xRwwi82mtP4MSrMd8CleUzbiPL3kkG0kPx3Y4Mw55Z0gPHzAKUklbj70B_F65OTlauOE7m4MLzh3k3S0OHIY46dqQv31b2TF7uY1wINxgW_JH3K8EUAG4Mc8FsD-CZ9cfP3gppSTHypQ";
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
    const input = req.body.message;
    const userjson = {}
    messages.push(input);
    const promptResponse = await processPrompt(input, authToken);
    console.log(promptResponse);
    messages.push(promptResponse.message.content);
    res.json(promptResponse);
  } catch (err) {
    next(err);
  }
});

app.get('/', async (req, res, next) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/messages', (req, res) => {    
  res.json(messages);
});

app.get('/clear', (req, res) => {    
  messages = [];
  res.json(messages);
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
