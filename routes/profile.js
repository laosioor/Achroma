const config = require('../modules/config');
const router = require("./router");
const auth = require('../middlewares/auth');

module.exports = ( function() {

    router.get('/profile', function(req, res) {
        res.render('profile');
    });

    router.get('/settings/profile', auth.verifyJWT, function(req, res) {
        res.send({id: req.userID});
    });
    
    return router;
 })();