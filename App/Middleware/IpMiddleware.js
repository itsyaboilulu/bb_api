const requestIp = require('request-ip');

module.exports = function(req, res, next) {
    req.ip = requestIp.getClientIp(req); 
    next();
};