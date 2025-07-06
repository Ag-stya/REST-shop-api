const redis = require('redis');

const redisClient = redis.createClient(); 

redisClient.on('error', err => console.error('Redis Cache Client Error', err));

redisClient.connect();

module.exports = redisClient;
