var mysql = require(`mysql`);
var config = require(`../configs/mysql.json`)
var express = require(`express`);

var connection = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: `world`,

    connectionLimit: 6
})

// Gracefully shut down the connection
process.on(`SIGTERM`, () => {
    console.log(`Trying to gracefully shut down the MYSQL connection!`);

    if (connection)
        connection.end()
})

module.exports = {
    pool: connection
}