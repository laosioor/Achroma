const crypto = require('crypto');

function getHash(pwd, salt) {
    var hashBuffer = crypto.pbkdf2Sync(pwd, salt, 100000, 255, 'sha512')
    var hashString = Buffer.from(hashBuffer, 'hex').toString('base64')
    return hashString.slice(-255)
}

function uniqueStr(length) {

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
}