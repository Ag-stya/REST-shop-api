
const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect()
  .then(() => console.log("🔌 Connected to Redis"))
  .catch(err => console.error("Redis Connect Error:", err));

module.exports = client;
