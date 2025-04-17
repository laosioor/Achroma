const config = require('../modules/config');
const router = require("./router");
const auth = require('../middlewares/auth');
const chromaReader = require('../modules/chromas');
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/profilePic/');
    },
    filename: function (req, file, cb) {
      cb(null, req.params.username + '.jpg');
    }
  })
  
  var upload = multer({ storage: storage })



module.exports = ( function() {

    router.get('/profile/:username', async function(req, res) {
      user = req.params.username;
        var validate = await config.dbValidateUsername(user);
        if (!validate) {
            res.status(404).send({status: 404, error: 'Not found'})

            return router;
        }

        var chromas = await chromaReader.findUserChromas(user);

        var behance = await config.dbReturn("behance", user);
        var deviantart = await config.dbReturn("deviantart", user);
        var pinterest = await config.dbReturn("pinterest", user);
        var twitter = await config.dbReturn("twitter", user);
        var bio = await config.dbReturn("bio", user);
        var profissao = await config.dbReturn("profissao", user);

        res.render('profile', {username: req.params.username, chromas: chromas, behance:behance, deviantart:deviantart, pinterest:pinterest, twitter:twitter, bio:bio, profissao:profissao});
        return router;
    });

    router.get('/edit', auth.verifyJWT, async function(req, res) {
        var username = await config.dbReturnUsername(req.userID);
        var userLink = "/profile/"+username;

        var behance = await config.dbReturn("behance", username);
        var deviantart = await config.dbReturn("deviantart", username);
        var pinterest = await config.dbReturn("pinterest", username);
        var twitter = await config.dbReturn("twitter", username);
        var bio = await config.dbReturn("bio", username);
        var profissao = await config.dbReturn("profissao", username);
        res.render('edit', {userLink:userLink, username:username, behance:behance, deviantart:deviantart, pinterest:pinterest, twitter:twitter, bio:bio, profissao:profissao});
    });

    router.post('/edit/:username', upload.single('uploadedPic'), auth.verifyJWT, async function (req, res){
        var userdata = req.body;

        var username = req.params.username;
        var behance = userdata.behance;
        var deviantart = userdata.deviantart;
        var pinterest = userdata.pinterest;
        var twitter = userdata.twitter;
        var bio = userdata.bioPost;
        var profissao = userdata.profissao;

        await config.dbInsert("update users set behance = ?, deviantart = ?, pinterest = ?, twitter = ?, bio = ?, profissao = ? where username = ?", [behance, deviantart, pinterest, twitter, bio, profissao, username]);

        pathFoda = '/profile/' + username;
        res.redirect(pathFoda);
    });
    
    return router;
 })();
