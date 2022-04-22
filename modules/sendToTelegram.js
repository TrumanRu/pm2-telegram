const http = require('https');

/**
 * @param {string} botToken
 * @param {string} chatId
 * @param {string} message
 * @param {'Markdown'|'HTML'} textFormat
 * @returns {Promise<unknown>}
 */
module.exports = async function sendToTelegram(botToken, chatId, message, textFormat = undefined) {
  let postData = `chat_id=${chatId}&text=${encodeURIComponent(message)}`;
  if (textFormat === 'Markdown' || textFormat === 'HTML') {
    postData += `&parse_mode=${textFormat}`;
  }
  console.log('TELEGRAM_SEND_DEBUG', postData, ...arguments);
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

      // write data to request body
      req.write(postData);
      req.end();
    } catch (e) {
      console.error(e);
    }
  });
}
