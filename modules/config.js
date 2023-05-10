const mysql = require('mysql2');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authConfig = require('../modules/auth');

module.exports = {
    getConn: function() {
        var con = mysql.createConnection({
            "host": "127.0.0.1",
            "user": "root",
            "password": "",
            "database": "achroma"
        })

        con.connect(function(err){
            if (err) throw err
        })

        return con
    },

    dbQuery: async function (query, param) {
        var con = this.getConn()

        var data = await con.promise().query(query, param)

        con.end()

        return data[0]
    },

    dbGetSingleRow: async function (query, param) {
        var data = await this.dbQuery(query, param)

        return data[0]
    },

    dbGetSingleValue: async function (query, param, defaultValue) {
        var data = await this.dbGetSingleRow(query, param)

        data = data ?? {}

        data = data.val ?? defaultValue

        return data
    },

    dbInsert: async function (query, param) {
        var con = this.getConn()

        var data = await con.promise().query(query, param)

        con.end()

        return data[0].insertId
    },

    dbValidateUsername: async function (username) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleValue("select count(*) as val from users where username=?", [username])
        

        if (dbRsp === 0) {
            con.end()
            return false
        } 
        con.end()
        return true;
    },

    dbReturn: async function(field, user) {
        var con = this.getConn()
        field = field.toString();
        var dbRsp = await this.dbGetSingleRow("select behance, deviantart, pinterest, twitter, bio, profissao from users where username = ?", [user]);
        if (dbRsp === 0) {
            con.end()
            return false
        }
        con.end()
        console.log(dbRsp);
        return dbRsp[field];
    },

    dbReturnUsername: async function (id) {
        var con = this.getConn()
        var dbRsp = await this.dbGetSingleRow("select (username) from users where id=?",[id])

        if (dbRsp === 0) {
            con.end()
            return false
        }
        con.end()
        return dbRsp["username"];
    },

    validateEmail: function (email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },

    validateUsername: function(username) {
        var re = /^[a-zA-Z0-9_]+$/;
        return re.test(username);
    },

    getHash: function(pwd, salt) {
        var hashBuffer = crypto.pbkdf2Sync(pwd, salt, 100000, 255, 'sha512')
        var hashString = Buffer.from(hashBuffer, 'hex').toString('base64')
        return hashString.slice(-255)
    },

    uniqueStr: function (length) {

        if (!length) {
            length = 128;
        }

        var s = [];
        var digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";
        for (var i = 0; i < length; i++) {
            s[i] = digits.substr(Math.floor(Math.random() * digits.length - 1), 1);
        }

        var guid = s.join("");
        return guid;
    },

    generateToken: function (user) {
        return jwt.sign({user}, authConfig.secret, {
            noTimestamp: true,
            expiresIn: 86400
        });

        
    },

    dbReturnAllChromas : async function() {
        var con = this.getConn()
        var dbRsp = await this.dbQuery("select * from chromas");

        array = []

        for (let i = 0; i < dbRsp.length; i++) {
            array.push(
                [dbRsp[i]["imageid"], dbRsp[i]["userid"]]);
        }
        con.end();

        for (let i = 0; i < array.length; i++) {
            array[i][1] = await this.dbReturnUsername(array[i][1]);
        }

        return array;
    },

    resSend(res, data, status, errors) {
        data = data ?? {}
        status = status?.toString() ?? this.resStatuses.ok
        errors = errors ?? []

        if (!Array.isArray(errors)) errors = [errors]

        var rspJson = {}
        rspJson.status = status
        rspJson.errors = errors
        rspJson.data = data

        res.send(JSON.stringify(rspJson))

    },

    resStatuses: Object.freeze({"ok": "OK", "error": "Error"})
}