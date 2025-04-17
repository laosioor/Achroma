const config = require('../modules/config');
const router = require("./router");
const auth = require("../middlewares/auth");
const jwt = require('jsonwebtoken');
const authConfig = require('../modules/auth');

module.exports = ( function() {

    router.get('/register', auth.verifyJWT, async function(req, res){
        res.render('register', {errors:[]});
    });
    
    router.post('/register', async function (req, res){
        var userdata = req.body
        var errors = [];

        // recebe os inputs dentro das suas respectivas váriaveis
        userdata.NEmail = userdata.NEmail?.toString() ?? ''
        userdata.NUsuario = userdata.NUsuario?.toString() ?? ''
        userdata.NSenha = userdata.NSenha?.toString() ?? ''
        userdata.NCSenha = userdata.NCSenha?.toString() ?? ''
    
        // verifica a existência de quaisquer erros nos inputs
        if (!config.validateEmail(userdata.NEmail)) errors.push("Email inválido")
        if ( (userdata.NUsuario.length === 0) || (userdata.NUsuario.length > 18) || (!config.validateUsername(userdata.NUsuario)) ) errors.push("Nome de usuário inválido")
        if (userdata.NSenha.length < 8) errors.push("A Senha precisa ter pelo menos 8 caracteres")
        if (userdata.NSenha !== userdata.NCSenha) errors.push("Senhas não coincidem")
    
        // inicia a conexão com o BD
        var con = config.getConn();

        // se não houver erros até aqui, realiza as queries no BD
        if (errors.length === 0) {
            var dbRsp = await config.dbGetSingleValue("select count (*) as val from users where email=?", [userdata.NEmail])
    
            // se o email digitado já existir dentro do BD, mostra o erro na página de registro
            if (dbRsp !== 0) {
                con.end();
                errors.push("Email já cadastrado");
                res.render("register", {errors:errors});
    
                return false
            }
    
            dbRsp = await config.dbGetSingleValue("select count (*) as val from users where username=?", [userdata.NUsuario])
    
            // se o username digitado já existir dentro do BD, mostra o erro na página de registro
            if (dbRsp !== 0) {
                con.end();
                errors.push("Usuário já existente");
                res.render("register", {errors:errors});
    
                return false
            }
    
            
            // declara a salt e o hash da senha digitada
            var salt = config.uniqueStr(255)
            var hash = config.getHash(userdata.NSenha, salt)
            
            // se não houver erros, cadastra o usuário no BD
            userdata.id = await config.dbInsert("insert into users (id, email, username, pwhash) values (0,?,?,?)", [
                userdata.NEmail,
                userdata.NUsuario,
                hash
            ])
    
            // se não houver erros, cadastra o salt junto do userID no BD
            await config.dbInsert("insert into salts values (0, ?, ?)", [userdata.id, salt])
            
            var userID = await config.dbGetSingleRow("select (id) from users where username=?",[userdata.NUsuario]);

            let token = jwt.sign({user: userID}, authConfig.secret, { expiresIn: 84000 } );

            res.cookie('token', "Bearer " + token, {
                httpOnly: true
            });

            res.redirect("/home");
            return router;
            
            
        }
        
        // caso tenha erros, reinicia a página e envia os erros
        res.render("register", {errors:errors});
    
    });

    return router;

})();


