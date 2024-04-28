const AuthHelper = require('./../Helpers/AuthHelper.js');

module.exports = function(req, res, next) {

    let authToken = req.header('authToken');

    if (!AuthHelper.isTokenValid(authToken)) {
        res.status(401);
        res.json({
            'logout': true,
            'error':'auth token missiing or expired'
        })
        
    } else {

        let decodedToken = AuthHelper.getDecodedToken(authToken);
        req.loggedInUser = decodedToken.user; 

        res.status(200);
        next();
    }
}