const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const config = require('./modules/config');

app.use(express.static(__dirname + '/static'));

app.use(express.urlencoded({
    extended: true
}))


app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', './pages');


router.get('/register', function(req,res){
    res.render('register', {errors:[]});
});

router.post('/register', async function (req, res){
    var userdata = req.body
    var errors = [];

    userdata.NEmail = userdata.NEmail?.toString() ?? ''
    userdata.NUsuario = userdata.NUsuario?.toString() ?? ''
    userdata.NSenha = userdata.NSenha?.toString() ?? ''
    userdata.NCSenha = userdata.NCSenha?.toString() ?? ''

    if (!config.validateEmail(userdata.NEmail)) errors.push("Email inválido!")
    if ( (userdata.NUsuario.length === 0) && (!config.validateUsername(userdata.NUsuario)) ) errors.push("Nome de usuário inválido")
    if (userdata.NSenha.length < 8) errors.push("Senha precisa de pelo menos 8 caracteres")
    if (userdata.NSenha !== userdata.NCSenha) errors.push("Senhas não coincidem")

    var con = config.getConn();
    if (errors.length === 0) {
        var dbRsp = await config.dbGetSingleValue("select count (*) as val from users where email=?", [userdata.NEmail])

        console.log(dbRsp);

        if (dbRsp !== 0) {
            

            con.end();
            errors.push("Email já cadastrado!");
            res.render("register", {errors:errors});

            return false
        }

        dbRsp = await config.dbGetSingleValue("select count (*) as val from users where username=?", [userdata.NUsuario])

        console.log(dbRsp)

        if (dbRsp !== 0) {
            con.end();
            errors.push("Usuário já existente!");
            res.render("register", {errors:errors});

            return false
        }

        var salt = config.uniqueStr(255)
        var hash = config.getHash(userdata.NSenha, salt)

        userdata.id = await config.dbInsert("insert into users values (0,?,?,?)", [
            userdata.NEmail,
            userdata.NUsuario,
            hash
        ])

        await config.dbInsert("insert into salts values (0, ?, ?)", [userdata.id, salt])
        
        res.redirect("/home");
        
    }
        
    res.render("register", {errors:errors});

});

router.get('/home', function(req, res){
    res.render('home');
});

router.get('/profile', function(req, res) {
    res.render('profile');
});

router.get('/login', function(req,res){
    res.render('login', {errors:[]});
});

router.post('/login', async function(req, res){
    var userdata = req.body
    var errors = []

    userdata.Usuario = userdata.Usuario?.toString() ?? ''
    userdata.Senha = userdata.Senha?.toString() ?? ''
    
    var con = config.getConn();
    if (errors.length === 0) {
        if (config.validateEmail(userdata.Usuario)) { // se é um email, procura os email foda
            var dbRsp = await config.dbGetSingleValue("select count(*) as val from users where email=?", [userdata.Usuario])

            console.log(dbRsp)

            if (dbRsp === 0) {
                con.end()
                errors.push("Email inválido!");
                res.render('login', {errors:errors});

                return false
            } 

            // já que o email existe, é preciso ver qual o ID do usuario, e mudar a variavel para ficar mais simples pro cabeção aqui
            var userID = await config.dbGetSingleRow("select id, username from users where email=?",[userdata.Usuario]);

            userdata.Usuario = userID["username"]
            console.log("usuario = " + userdata.Usuario)

            userID = userID["id"]
            console.log("id = " + userID);

        } else { // senão, bora ver se é um nome de usuário então
            var dbRsp = await config.dbGetSingleValue("select count(*) as val from users where username=?", [userdata.Usuario])

            console.log(dbRsp)

            if (dbRsp === 0) {
                con.end()
                errors.push("Usuário inválido!");
                res.render('login', {errors:errors});
                return false
            } 
            // já que o user existe, é preciso ver qual o ID do usuario
            var userID = await config.dbGetSingleRow("select (id) from users where username=?",[userdata.Usuario]);

            userID = userID["id"]
            console.log(userID);
        }

        // ver o salt do usuário, para confirmar a senha digitada com o hash armazenado no BD
        var salt = await config.dbGetSingleRow("select (salt) from salts where userid=?", [userID]);

            salt = salt["salt"];
            console.log(salt);
            
            var dbPwHash = await config.dbGetSingleRow("select (pwhash) from users where id=?",[userID]);

            dbPwHash = dbPwHash["pwhash"];
            console.log(dbPwHash);
            

            console.log(config.getHash(userdata.Senha, salt));
            // se a senha digitada, junto do salt, for igual ao hash do BD, dá bom, caso o contrário da ruim
            if (!(config.getHash(userdata.Senha, salt) === dbPwHash)) {
                con.end()

                errors.push("Senha incorreta!");
                res.render('login', {errors:errors});

                return false


            } 

            res.redirect('/home');
            // se der tudo certo, o cara pode entrar aleluia
    }

    res.render('login', {errors:errors});
});

app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Rodano na porta 3000');


