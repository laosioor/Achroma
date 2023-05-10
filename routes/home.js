const config = require('../modules/config');
const chromaReader = require('../modules/chromas');
const router = require("./router");
const auth = require("../middlewares/auth");
const multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static/chromas/');
    },
    filename: function (req, file, cb) {
      cb(null, req.params.user + ' ' + req.params.number + '.jpg');
    }
  })
  
  var upload = multer({ storage: storage })

module.exports = ( function() {
    
    router.get('/home', auth.verifyJWT, async function(req, res){
      try {  
        var username = await config.dbReturnUsername(req.userID);
      } catch {
        res.redirect('/signout');
      }
        var userLink = "/profile/"+username;
        var chromas = await chromaReader.findChroma(); //pega o id das imagens e o nome do usuario que postou
        var number = await chromaReader.generateNumber(chromaReader.returnNumbers(chromas));
        var chromas = chromas.sort(() => Math.random() - 0.5) //randomiza as imagens
  
        res.render('home', {userLink:userLink, chromas:chromas, username:username, number:number});
        
        
        
    });

    router.post('/home/:user&:number', upload.single('uploadedChroma'), auth.verifyJWT, (req, res) => {
        res.redirect('/home');
    });

    return router;
    
 })();