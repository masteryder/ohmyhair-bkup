var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 100,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'ohmyhairdb',
    debug    :  false,
    dateStrings: 'date'
});

module.exports = pool;