const http = require('https');

/**
 * @param {string} botToken
 * @param {string} chatId
 * @param {string} message
 * @returns {Promise<unknown>}
 */
module.exports = async function sendToTelegram(botToken, chatId, message) {
  const postData = `chat_id=${chatId}&text=${message}`; //&parse_mode=Markdown
  /** @Type {https.RequestOptions} */
  const options = {
    hostname: 'api.telegram.org',
    //port: 443,
    path: `/bot${botToken}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  return new Promise((resolve, reject) => {
    try {
      const req = http.request(options, (res) => {
        const responseBody = [];
        res.setEncoding('utf8');

        // collect response data
        res.on('data', (chunk) => {
          responseBody.push(chunk);
        });

        // response data collected
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              resolve(responseBody.join());
            } else {
              reject(`Status: ${res.statusCode}\n${responseBody.join()}`)
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (e) => {
        console.error(`Problem on send to Telegram: ${e.message}`);
        reject(e);
      });

      // Write data to request body
      req.write(postData);
      req.end();
    } catch (e) {
      console.error(e);
    }
  });
}
