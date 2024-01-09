const logger = (req, res, next) =>{
    console.log(`${req.method} ${req.protocol}:\\ ${req.get('host')} ${req.originalUrl}`);
    next(); // Call next() to pass control to the next middleware or route handler

}

module.exports = logger;