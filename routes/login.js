const config = require('../modules/config');
const router = require("./router");
const jwt = require('jsonwebtoken');
const authConfig = require('../modules/auth');

module.exports = ( function() {

    router.get('/logout', function(req, res){
        res.status(200).send({auth: false, token: null });
    });

    router.get('/login', function(req,res){
        res.render('login', {errors:[]});
    });
    
    router.post('/login', async function(req, res){
        var userdata = req.body
        var errors = []
    
        // recebe os inputs dentro das suas respectivas váriaveis
        userdata.Usuario = userdata.Usuario?.toString() ?? ''
        userdata.Senha = userdata.Senha?.toString() ?? ''
        
        // inicia a conexão com o BD
        var con = config.getConn();

        if (config.validateEmail(userdata.Usuario)) { // se é um email, procura os email foda
            var dbRsp = await config.dbGetSingleValue("select count(*) as val from users where email=?", [userdata.Usuario])

            if (dbRsp === 0) {
                con.end()
                errors.push("Email inválido");
                res.render('login', {errors:errors});

                return false
            } 

            // já que o email existe, é preciso ver qual o ID do usuario
            var userID = await config.dbGetSingleRow("select (id) from users where email=?",[userdata.Usuario]);


        } else { // senão, bora ver se é um nome de usuário então
            var dbRsp = await config.dbGetSingleValue("select count(*) as val from users where username=?", [userdata.Usuario])

            if (dbRsp === 0) {
                con.end()
                errors.push("Usuário inválido");
                res.render('login', {errors:errors});
                return false
            } 
            // já que o user existe, é preciso ver qual o ID do usuario
            var userID = await config.dbGetSingleRow("select (id) from users where username=?",[userdata.Usuario]);

        }

        // ver o salt do usuário, para confirmar a senha digitada com o hash armazenado no BD
        var salt = await config.dbGetSingleRow("select (salt) from salts where userid=?", [userID]);

            salt = salt["salt"];
            
            var dbPwHash = await config.dbGetSingleRow("select (pwhash) from users where id=?",[userID]);

            dbPwHash = dbPwHash["pwhash"];
            
            // se a senha digitada, junto do salt, for igual ao hash do BD, dá bom, caso o contrário da ruim
            if (!(config.getHash(userdata.Senha, salt) === dbPwHash)) {
                con.end()

                errors.push("Senha incorreta");
                res.render('login', {errors:errors});

                return false
            } 

            let token = jwt.sign({user: userID},authConfig.secret, { expiresIn: 84000 } );

            res.cookie('token', "Bearer " + token, {
                httpOnly: true
            });

            // se der tudo certo, o cara pode entrar aleluia
            return res.redirect('/home');
            
    });

    return router;
    
 })();