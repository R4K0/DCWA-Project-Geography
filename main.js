const {pool} = require(`./databases/mysql`);
var express = require("express");
var path = require(`path`)
var cors = require(`cors`)

var app = express()

app.use(cors())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/html'))

function getCountriesAll(){
    return new Promise( (resolve, reject) => {
        pool.query( "SELECT * FROM country", function(err, results, fields){
            if(err){
                reject(err);
                return;
            }
            

            resolve(results);
        })
    })
}

app.get( `/countries/list`, async (req, res) => {
    const countries = await getCountriesAll()

    res.render(`./countries.ejs`, {countries: countries} )
} )

app.get( '/countries/all', async (req, res) => {
    try{
        var countries = await getCountriesAll();

        res.status(200).json(countries);
    }catch(err){
        res.status(500).send(err.sqlMessage || "Error")
    }
})


app.listen(3000, () => {
    console.log(`Listening on port 3000`);
})