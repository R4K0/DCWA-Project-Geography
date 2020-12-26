var mysql = require(`mysql`);
var config = require(`../configs/mysql.json`)

var connection = mysql.createConnection({
    host: `${config.host}:${config.port}`,
    user: config.user,
    password: config.password
})

connection.connect((err) => {
    if (err) {
        console.log(err);
    }

    console.log(`Connected to the MySQL database!`);
})

// Gracefully shut down the connection
process.on(`SIGTERM`, () => {
    console.log(`Trying to gracefully shut down the MYSQL connection!`);

    if (connection)
        connection.end()
})

exports = mysql;