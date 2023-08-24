const axios = require('axios');

function processPrompt(input, authToken) {
  return axios.post(
    'https://openai.work.iqvia.com/cse/prod/chat-api/api/v1/conversations',
    {
      messages: [{
        role: 'user',
        content: input
      }],
      model: 'dep-cio-openaiebt01-gpt35turbo'
    },
    {
      headers: {
        'Current-Account': 'az-cs-eaus-cio-ebtaiml-openai-d01',
        'Authorization': `Bearer ${authToken}`
      }
    }
  )
    .then((res) => {
      if (res.status >= 400) {
        const err = new Error(res.statusText);
        err.status = res.status;
        throw err;
      }
      return res.data;
    });
}

module.exports.processPrompt = processPrompt;
