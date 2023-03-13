'use strict';

const https = require('https');

class TelegramSender {
  constructor() {

  }

  /**
   * @param {string} botToken
   * @param {string} chatId
   * @param {string} message
   * @returns {Promise<unknown>}
   */
  async sendToTelegram(botToken, chatId, message,) {
    let postData = `chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    //console.log('TELEGRAM_SEND_DEBUG', postData, '\nARGUMENTS', ...arguments);

    /** @Type {https.RequestOptions} */
    const options = {
      protocol: 'https:',
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
        const req = https.request(options, (res) => {
          res.setEncoding('utf8');

          // collect response data
          const responseBody = [];
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
}
module.exports = {
  TelegramSender,
};
