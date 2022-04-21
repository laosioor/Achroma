const config = require('../modules/config');
const router = require("./router");
module.exports = ( function() {
    
    router.get('/home', function(req, res){
        res.render('home');
    });

    return router;
    
 })();