const jwt= require("jsonwebtoken");
const redisClient= require('../redis/cacheClient');
module.exports= async (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Auth failed: Missing token' });
        }

        const token = authHeader.split(' ')[1];

        //  Check Redis blacklist first
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Auth failed: Token blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        req.token = token; // needed for logout
        next();
    } 
    catch (error) {
        return res.status(401).json({ message: 'Auth failed: Invalid token' });
    }


};