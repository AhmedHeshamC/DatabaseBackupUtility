const axios = require('axios');

/**
 * Send a message to Slack via incoming webhook URL
 * @param {string} webhookUrl - Slack Incoming Webhook URL
 * @param {Object} payload - Payload object to send (e.g., { text: '...' })
 */
async function sendSlackNotification(webhookUrl, payload) {
  if (!webhookUrl) throw new Error('Slack webhook URL is required');
  try {
    const res = await axios.post(webhookUrl, payload);
    return res.data;
  } catch (err) {
    console.error('Failed to send Slack notification:', err.message);
    throw err;
  }
}

module.exports = { sendSlackNotification };