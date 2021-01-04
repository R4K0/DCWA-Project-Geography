const { getAllCities, getCitiesByCountry, getCountriesAll, getCountryByCode, removeCity, getCountryCodes, addCity, addCountry } = require(`./databases/mysql`);
const { HeadSchema, HeadModel } = require("./databases/mongo")
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
    try {
        var rows = await removeCity(req.body.ID)

        res.status(200).json({
            rowsAffected: rows.affectedRows
        });
    } catch (error) {
        res.sendStatus(400);
    }
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
    try {
        var cities = await getAllCities()
        var country_codes = await getCountryCodes()

        res.render(`./cities_all.ejs`, { cities: cities, codes: country_codes });
    } catch (error) {
        res.sendStatus(500)
    }
})

app.get('/cities/:country', async (req, res) => {
    try {
        const cities = await getCitiesByCountry(req.params.country);

        res.render('./cities.ejs', { cities: cities });
    } catch (error) {
        res.sendStatus(500)
    }
})

app.get(`/countries/list`, async (req, res) => {
    try {
        const countries = await getCountriesAll()

        res.render(`./countries.ejs`, { countries: countries })
    } catch (error) {
        res.sendStatus(400)
    }
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
    try {
        var heads = await HeadModel.find();
        var codes = await getCountryCodes()

        res.render("./heads.ejs", { heads: heads, codes: codes })
    } catch (error) {
        res.sendStatus(400)
    }

})

app.post("/heads", async (req, res) => {
    try {
        await HeadModel.findOneAndUpdate({ _id: req.body.co_code }, { _id: req.body.co_code, headOfState: req.body.head_name }, { upsert: true, new: true })

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
})

app.listen(3000, () => {
    console.log(`Listening on port 3000`);
})