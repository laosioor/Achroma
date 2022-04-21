const mysql = require('mysql2');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authConfig = require('../modules/auth');

module.exports = {
    getConn: function() {
        var con = mysql.createConnection({
            "host": "127.0.0.1",
            "user": "root",
            //"port": "3308", //apagar, isso é pra eletro merda
            "password": "",
            "database": "alotest"
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

    dbGetSingleValue: async function (query, param, defalutValue) {
        var data = await this.dbGetSingleRow(query, param)

        data = data ?? {}

        data = data.val ?? defalutValue

        return data
    },

    dbInsert: async function (query, param) {
        var con = this.getConn()

        var data = await con.promise().query(query, param)

        con.end()

        return data[0].insertId
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