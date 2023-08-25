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
    authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIyYTQ1OWRmOS1kOGUxLTQzZTAtOTk4ZS0zMjBhYmJlNTgxZDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEvIiwiaWF0IjoxNjkyOTgyNDQxLCJuYmYiOjE2OTI5ODI0NDEsImV4cCI6MTY5Mjk4NjM5OCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhVQUFBQXFJWGJETmYrTzYwc0RTUi9DMTJlb2x5K20xUlJFSjR0U3BnWjhaZzRuNlBOSUVUWTZNV1c1cTdvRmtWYkNVYnMiLCJhbXIiOlsicHdkIiwid2lhIl0sImFwcGlkIjoiMmE0NTlkZjktZDhlMS00M2UwLTk5OGUtMzIwYWJiZTU4MWQwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJQYW5kZSIsImdpdmVuX25hbWUiOiJBamlua3lhIiwiZ3JvdXBzIjpbIjRmMTIxM2U1LWEyYTQtNDVlMC05MjVlLWFiODcyOTFkYjU4MCJdLCJpcGFkZHIiOiIyMC4yMTIuOTkuMTUiLCJuYW1lIjoiUGFuZGUsIEFqaW5reWEgRVgxIiwib2lkIjoiYTcxMGY2NTYtMDU3Yi00ZDdlLWFhODMtMWZhNDg1OTc0NTI0Iiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTEzNzk4MTc2NC0xNzA5Nzg3OTg4LTIzMTE0NTc3MS01OTA5ODE5IiwicmgiOiIwLkFRZ0E0T3lKV1E3NXYwQ2NlUnA3N00yNFlmbWRSU3JoMk9CRG1ZNHlDcnZsZ2RBSUFIZy4iLCJzY3AiOiJHcm91cC5SZWFkLkFsbCBHcm91cE1lbWJlci5SZWFkLkFsbCBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCIsInN1YiI6ImpocHNVbHY5MkhoQm91SXlwcml6Vnloa0pPRzRLcUFvZVBHYndYZ2d4ZmMiLCJ0aWQiOiI1OTg5ZWNlMC1mOTBlLTQwYmYtOWM3OS0xYTdiZWNjZGI4NjEiLCJ1bmlxdWVfbmFtZSI6IkFQYW5kZUB1cy5pbXNoZWFsdGguY29tIiwidXBuIjoiQVBhbmRlQHVzLmltc2hlYWx0aC5jb20iLCJ1dGkiOiJDSDBzNWZVbmtVLTRKTUJYR3VlTEFBIiwidmVyIjoiMS4wIn0.TlMuYtz36Os9HUz0qT7SKvCtRbn7rRgqdNuEPouEIb9Zr0tliZ86yg2mC3MWoqkhnLaAu-nKzA_qCH7Frxz3jjkie1sGL_Pcl_LkySGuGztkQjpUMNcTU9Z7wgEhkibq_YCZ7_Cy1pCVQb2XLu8CDl1M9RqQecj54-bIgWPEBFWPApjEfFXRkKdRUL39ARSWabJ3dHhy4M8qsVP_XPa86fqEXMObf4TmZPdts2Sf8WiYv5zhraGEHh8JfkqggUHBpnF8K37tRy8QO8K_gmLiboffVgcz0CKMTGGOPnF7DNzq3KUmqoaTqy7nDG4vQSNObGz6hJysZau-K3TqnkutSA";
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
