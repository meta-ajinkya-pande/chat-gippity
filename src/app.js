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
    authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIyYTQ1OWRmOS1kOGUxLTQzZTAtOTk4ZS0zMjBhYmJlNTgxZDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEvIiwiaWF0IjoxNjkyOTc2OTM4LCJuYmYiOjE2OTI5NzY5MzgsImV4cCI6MTY5Mjk4MDk5NywiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhVQUFBQVZ3ZUszRDBORmJvdHdNV3h5S2JIVGgybjV3VVptNWJiaEg3Y2xsVEJlb2VIL1ptY0RLc0NEb21OTVBGMGNPWGciLCJhbXIiOlsicHdkIiwid2lhIl0sImFwcGlkIjoiMmE0NTlkZjktZDhlMS00M2UwLTk5OGUtMzIwYWJiZTU4MWQwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJQYW5kZSIsImdpdmVuX25hbWUiOiJBamlua3lhIiwiZ3JvdXBzIjpbIjRmMTIxM2U1LWEyYTQtNDVlMC05MjVlLWFiODcyOTFkYjU4MCJdLCJpcGFkZHIiOiIyMC4yMTIuOTkuNjIiLCJuYW1lIjoiUGFuZGUsIEFqaW5reWEgRVgxIiwib2lkIjoiYTcxMGY2NTYtMDU3Yi00ZDdlLWFhODMtMWZhNDg1OTc0NTI0Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEzNzk4MTc2NC0xNzA5Nzg3OTg4LTIzMTE0NTc3MS01OTA5ODE5IiwicmgiOiIwLkFRZ0E0T3lKV1E3NXYwQ2NlUnA3N00yNFlmbWRSU3JoMk9CRG1ZNHlDcnZsZ2RBSUFIZy4iLCJzY3AiOiJHcm91cC5SZWFkLkFsbCBHcm91cE1lbWJlci5SZWFkLkFsbCBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCIsInN1YiI6ImpocHNVbHY5MkhoQm91SXlwcml6Vnloa0pPRzRLcUFvZVBHYndYZ2d4ZmMiLCJ0aWQiOiI1OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEiLCJ1bmlxdWVfbmFtZSI6IkFQYW5kZUB1cy5pbXNoZWFsdGguY29tIiwidXBuIjoiQVBhbmRlQHVzLmltc2hlYWx0aC5jb20iLCJ1dGkiOiI4bXpDdlQ3QVNrQ1l1V2ZUTFJPaEFBIiwidmVyIjoiMS4wIn0.YDjkuVIzBauajfIcXBY_zJYZh4O5XP6k8RzOYFUGXvmK94k09JmsRurs1m7Sz46w9ckhBRiEzD03dQW4_-w905W5hAPkE3YLwevqg4NpirBNS87yZ0RI3TbVB1WON54dYHOFUMcWGRQP6Rq62tuOfOfesUq1KvGY1ZntFg3zMJ0cnzCZH3QxeNyX9UMuSiH_1JoORVmLhcEPisS57NLid9UASODSk8IhdjPswQ8GleHE2flKCppBVplZ-o2qf_i7SBQ63Kv8nzEgmXuhlFm_aKlLFlFQ_PXbuJhbZoAT0midoAAy3h5ArcSJaRvXvyqgqqDXszQkaJDzLw1lePTzqA";
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
    let message = {};
    message.role = "user";
    message.content = input;
    messages.push(message);
    const promptResponse = await processPrompt(messages, authToken);
    message = {};
    message.role = promptResponse.message.role;
    message.content = promptResponse.message.content;
    messages.push(message);
    res.json(messages);
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
