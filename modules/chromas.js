const fs = require('fs');
const path = require('path');
const { dbInsert } = require('./config');
const config = require('./config');
const multer = require('multer');

module.exports = {
    findChroma: async function() {
        var folderPath = './static/chromas/';
        var isFile = fileName => {
        return fs.lstatSync(fileName).isFile();
      };
        var chromaArray = [];
        fs.readdirSync(folderPath).map(fileName => {
            chromaArray.push(fileName);
        })
        chromaArray = this.splitArray(chromaArray);

        for(let i = 0; i < chromaArray.length; i++) {
            chromaArray[i][0] = chromaArray[i][0].replace(chromaArray[i][0], await this.usernameToId(chromaArray[i][0]));

            if (chromaArray[i][0] == "nulo") {
                chromaArray[i] = null;
            }
        }
        chromaArray = chromaArray.filter(n => n);
        this.generateNumber(this.returnNumbers(chromaArray));
        return chromaArray;
    },

    findUserChromas: async function(username) {
        var folderPath = './static/chromas/';
        var isFile = fileName => {
        return fs.lstatSync(fileName).isFile();
      };
        var chromaArray = [];
        fs.readdirSync(folderPath).map(fileName => {
            chromaArray.push(fileName);
        })

        chromaArray = this.splitArray(chromaArray);
        
        for(let i = 0; i < chromaArray.length; i++) {
            chromaArray[i][0] = chromaArray[i][0].replace(chromaArray[i][0], await this.usernameToId(chromaArray[i][0]));

            if (chromaArray[i][0] == "nulo") {
                chromaArray[i] = null;
            } else if (chromaArray[i][0] != username) {
                chromaArray[i] = null;

            }
        }
        chromaArray = chromaArray.filter(n => n);
        return chromaArray;
    },

    splitArray: function(arrayImg) {
        var novaArray = [];
        for (let i = 0; i < arrayImg.length; i++) {
            let a = arrayImg[i];
            a = a.replace(".jpg", "");   
            novaArray.push(a.split(" "));
        }
        return novaArray;
    },

    usernameToId: async function(username) {
        try {
            var t = await config.dbGetSingleRow("select * from users where username = ?", [username]);

            t = t["username"];
            return t;
        } catch {
            return "nulo";
        }
    },

    returnNumbers: function(array) { // pra separar os númerozinho dos nome de usuário
        arrayNumbers = [];
        for (i = 0; i < array.length; i++) {
            arrayNumbers.push(array[i][1]);
        }

        return arrayNumbers;
    },

    generateNumber: function(array) {
        
        max = this.largestInt(array);

        do {
            max++;
            num = max;
        } while (array.includes(num.toString()));

        return num;
    },

    largestInt: function(array) {
        largest = parseInt(array[0]);
        for (var i = 0; i < array.length; i++) {
            if (largest < parseInt(array[i]) ) {
                largest = parseInt(array[i]);
            }
        }
        return largest;
    },

    deleteProfilePic: function(filename) {
        var filePath = './static/profilePic/' + filename + '.jpg';
        fs.unlinkSync(filePath);

        return "deletado";
    }
}