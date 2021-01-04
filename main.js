const { getAllCities, getCitiesByCountry, getCountriesAll, getCountryByCode, removeCity, getCountryCodes, addCity, addCountry } = require(`./databases/mysql`);
const { HeadSchema } = require("./databases/mongo")
var express = require("express");
var path = require(`path`)
var cors = require(`cors`)
var bodyparser = require(`body-parser`)

var app = express()

app.use(express.static('public'))

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cors())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/html'))


app.get(`/`, (req, res) => {
    res.render('./home.ejs')
})

app.post("/cities/delete", async (req, res) => {
    var rows = await removeCity(req.body.ID)

    res.status(200).json({
        rowsAffected: rows.affectedRows
    });
})

app.post("/cities", async (req, res) => {
    try {
        var rows = await addCity(req.body.cty_code, req.body.co_name, req.body.cty_name, req.body.population, req.body.coast, req.body.area);

        res.status(200).json({
            rowsAffected: rows.affectedRows
        });
    } catch (error) {
        res.status(400).send(error.sqlMessage)
    }
})

app.post("/countries", async (req, res) => {
    try {
        var rows = await addCountry(req.body.co_code, req.body.co_name, req.body.detail);

        res.status(200).json({
            rowsAffected: rows.affectedRows
        });
    } catch (error) {
        res.status(400).send(error.sqlMessage)
    }
})

app.get('/cities/all', async (req, res) => {
    var cities = await getAllCities()
    var country_codes = await getCountryCodes()

    res.render(`./cities_all.ejs`, { cities: cities, codes: country_codes });
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

app.get('/heads/all', async (req, res) => {
    var heads = HeadSchema

    res.render("./heads.ejs")
})


app.listen(3000, () => {
    console.log(`Listening on port 3000`);
})