var mysql = require(`mysql`);
var config = require(`../configs/mysql.json`)

var pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: `geography`,

    connectionLimit: 6
})

// Gracefully shut down the connection
process.on(`SIGTERM`, () => {
    console.log(`Trying to gracefully shut down the MYSQL connection!`);

    if (pool)
        pool.end()
})

function getAllCities() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM city LEFT JOIN country ON country.co_code = city.co_code", function (err, data) {
            if (err) {
                reject(err);
                return;
            }

            resolve(data)
        })
    })
}

function removeCity(ID) {
    return new Promise((resolve, reject) => {
        pool.query("DELETE FROM city WHERE cty_code = ?", ID, function (err, data) {
            if(err){
                reject(err);
                return;
            }

            resolve(data);
        })
    })
}

function getCitiesByCountry(countryCode) {
    return new Promise((resolve, reject) => {
        if (!countryCode) {
            reject(new Error("No country code provided!"))
            return;
        }

        pool.query("SELECT * FROM city LEFT JOIN country ON country.co_code = city.co_code WHERE city.co_code = ? ORDER BY city.population DESC", countryCode.toUpperCase(), function (err, results) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results)
        })
    })
}

function getCountriesAll() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * from country", function (err, results) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        })
    })
}

function getCountryByCode(countryCode) {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * from country WHERE co_code = ?", countryCode.toUpperCase(), function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        })
    })
}

function getCountryCodes(){
    return new Promise((resolve, reject) => {
        pool.query("SELECT co_code, co_name from country", function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        })
    })
}

function addCity(cty_code, co_code, cty_name, population, coastal, areaKM){
    coastal = coastal == 'on' ? 'true' : 'false' //In the database it is stored as a string enum, so we convert it to it here.

    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO city VALUES(?, ?, ?, ?, ?, ?)", [cty_code, co_code, cty_name, population, coastal, areaKM], function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        })
    })
}

function addCountry(co_code, co_name, details){
    return new Promise((resolve, reject) => {
        pool.query("INSERT INTO country VALUES(?, ?, ?)", [co_code, co_name, details], function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        })
    })
}


module.exports = {
    getCountryByCode,
    getCountriesAll,
    getCitiesByCountry,
    removeCity,
    getAllCities,
    getCountryCodes,
    addCity,
    addCountry
}