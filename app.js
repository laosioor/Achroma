const express = require('express');
const app = express();
const router = require("./routes/router");
const register = require('./routes/register');
const login = require('./routes/login');
const home = require('./routes/home');
const profile = require('./routes/profile');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({
    extended: true
}))

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', './pages');

app.use(cookieParser());
app.use(cors());

app.use(router, (req, res) => {
    res.status(404).send({status: 404,
    error: 'Not found'})
});
app.use(register);
app.use(login);
app.use(home);
app.use(profile);


app.listen(3000);
console.log('localhost:3000/');