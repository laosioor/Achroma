const express = require("express");
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth.verifyJWT, function (req, res){
    res.redirect('/home');
});

router.get('/signout', function (req, res){
    res.clearCookie('token');
    res.redirect('/login');
})

module.exports = router;