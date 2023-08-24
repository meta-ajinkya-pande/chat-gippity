const axios = require('axios');

function getAuthToken() {
  return axios.get('https://openai.work.iqvia.com/cse/prod/auth/my-token')
    .then((res) => {
      if (res.status >= 400) {
        const err = new Error(res.statusText);
        err.status = res.status;
        throw err;
      }
      console.log(res);
      return res.data.token.access_token;
    });
}

module.exports.getAuthToken = getAuthToken;
