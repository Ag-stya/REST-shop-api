const redisClient = require('../redis/redisClient');

const RATE_LIMIT_WINDOW = 60; // 60 seconds
const MAX_REQUESTS = 10;      // max 10 reqs per minute

const rateLimiter = async (req, res, next) => {
  try {
    // ✅ 1. Skip rate limiting for static image files (e.g. /uploads/xxx.jpeg)
    if (req.path.startsWith("/uploads/")) {
      return next(); // allow image requests without hitting Redis
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const redisKey = `rate_limit:${ip}`;

    console.log(` Incoming request from IP: ${ip}`);
    console.log(` Redis key being used: ${redisKey}`);

    const current = await redisClient.incr(redisKey);
    console.log(` Request count for ${redisKey}: ${current}`);

    if (current === 1) {
      await redisClient.expire(redisKey, RATE_LIMIT_WINDOW);
      console.log(` Expiry set for ${redisKey} to ${RATE_LIMIT_WINDOW}s`);
    }

    if (current > MAX_REQUESTS) {
      const ttl = await redisClient.ttl(redisKey);
      console.log(` Rate limit exceeded for ${redisKey}, TTL left: ${ttl}s`);

      return res.status(429).json({
        message: `Too many requests. Try again in ${ttl} seconds.`,
      });
    }

    next();
  } catch (error) {
    console.error("Rate Limiter Error:", error);
    return res.status(500).json({ message: "Internal rate limit error" });
  }
};

module.exports = rateLimiter;
