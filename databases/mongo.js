var mongoose = require("mongoose")
var settings = require("../configs/mongo.json")

mongoose.connect(`mongodb://localhost:${settings.port}`, { useNewUrlParser: true, useUnifiedTopology: true, dbName: settings.database }, () => {
    console.log("MongoDB successfully connected!");
})

const HeadSchema = new mongoose.Schema({
    _id: { type: String },
    headOfState: { type: String, required: true }
}, {collection: settings.database})

const HeadModel = mongoose.model( "head", HeadSchema )

module.exports = {
    HeadModel,
    HeadSchema
}