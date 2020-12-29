const { pool } = require(`./databases/mysql`);
var express = require("express");
var path = require(`path`)
var cors = require(`cors`)

var app = express()

app.use(express.static('public'))

app.use(cors())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/html'))

function getCountriesAll() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT *, country.Name as CountryName, city.Name as CapitalName FROM country LEFT JOIN city ON country.Capital = city.ID", function (err, results, fields) {
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
        pool.query("SELECT *, country.Name as CountryName, city.Name as CapitalName FROM country LEFT JOIN city ON country.Capital = city.ID WHERE Code = ?", countryCode.toUpperCase(), function (err, results, fields) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results);
        })
    })
}

function getLanguagesInCountry(countryCode) {
    return new Promise((resolve, reject) => {
        if (!countryCode) {
            reject(new Error("No country code provided!"))
            return;
        }

        pool.query("SELECT * FROM countrylanguage WHERE CountryCode = ?", countryCode.toUpperCase(), function (err, results) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results)
        })
    })
}

app.get(`/languages/:country`, async (req, res) => {
    var languages;
    var country;

    try {
        country = await getCountryByCode(req.params.country);
        languages = await getLanguagesInCountry(req.params.country);
    } catch (err) {
        res.status(500).send(err);
    }

    if (languages == false || country == false) {
        res.send("No country to list")
        return;
    }

    console.log(country);

    res.render('./languages.ejs', { languages: languages, countryName: country[0].Name })
})

function getCitiesByCountry(countryCode) {
    return new Promise((resolve, reject) => {
        if (!countryCode) {
            reject(new Error("No country code provided!"))
            return;
        }

        pool.query("SELECT city.Population, city.Name as CityName, country.Name as CountryName FROM city LEFT JOIN country ON country.Code = city.CountryCode WHERE CountryCode = ?", countryCode.toUpperCase(), function (err, results) {
            if (err) {
                reject(err);
                return;
            }

            resolve(results)
        })
    })
}

function getAllCities() {
    return new Promise((resolve, reject) => {
        pool.query("SELECT * from city", function(err, data) {
            if (err){
                reject(err);
                return;
            }

            resolve(data)
        })
    })
}

app.get('/cities/all', async (req, res) => {
    var cities = await getAllCities()

    res.render(`./cities_all.ejs`, {cities: cities});
})

app.get('/cities/:country', async (req, res) => {
    const cities = await getCitiesByCountry(req.params.country);

    res.render('./cities.ejs', { cities: cities });
})

app.get(`/countries/list`, async (req, res) => {
    //TODO: Catch errors and handle them
    const countries = await getCountriesAll()

    res.render(`./countries.ejs`, { countries: countries })
})

app.get('/countries/all', async (req, res) => {
    try {
        var countries = await getCountriesAll();

        res.status(200).json(countries);
    } catch (err) {
        res.status(500).send(err.sqlMessage || "Error")
    }
})


app.listen(3000, () => {
    console.log(`Listening on port 3000`);
})