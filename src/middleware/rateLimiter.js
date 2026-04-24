import rateLimit from "express-rate-limit";

export const logInLimiter = rateLimit({
    windowMs: 60*1000,
    limit: process.env.NODE_ENV === 'test' ? 1000 : 3,
    handler: function(req, res, next) {
        const err = new Error('Too many login requests. Try again later.');
        err.status = 429;
        next(err);
    }
});