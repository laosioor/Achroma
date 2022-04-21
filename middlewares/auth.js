const jwt = require('jsonwebtoken');
const authConfig = require('../modules/auth');

module.exports = {
    verifyJWT: function(req, res, next) {
        const authCookie = req.cookies.token;

        if (!authCookie) {
            //return res.status(401).send({error: 'No token provided'});
            res.clearCookie('token');
            return res.redirect('/login');
        }

        const parts = authCookie.split(' ');

        if (!parts.length === 2) {
            //return res.status(401).send({error: 'Token error'});
            res.clearCookie('token');
            return res.redirect('/login');
        }

        const [ scheme, token ] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            //return res.status(401).send({error: 'Token malformatted'});
            res.clearCookie('token');
            return res.redirect('/login');
        }

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            req.userID = decoded.user.id;

            return next();
        });

        
    }    
};