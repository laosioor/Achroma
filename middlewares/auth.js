const jwt = require('jsonwebtoken');
const authConfig = require('../modules/auth');

module.exports = {
    verifyJWT: function(req, res, next) {
        const authCookie = req.cookies.token;
        if (!authCookie) {
            if ((req.route.path) === '/login' || (req.route.path === '/register')) { // se já tiver logado, e tentar entrar na rota /login ou /register continua na mesma rota, pra não dar problema
                return next();
            } 
            res.clearCookie('token');
            return res.redirect('/login');

        }

        const parts = authCookie.split(' ');

        if (!parts.length === 2) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        const [ scheme, token ] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if (err) {
                res.clearCookie('token');
                return res.redirect('/login');
            }

            req.userID = decoded.user.id;
            if ((req.route.path) === '/login' || (req.route.path === '/register')) {
                return res.redirect('/home'); 
            }
            return next();
        });
    }    
};