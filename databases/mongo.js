var mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "headsOfStateDB" }, () => {
    console.log("MongoDB successfully connected!");
})

const HeadSchema = new mongoose.Schema({
    _id: { type: String },
    headOfState: { type: String, required: true }
}, {collection: "headsOfState"})

const HeadModel = mongoose.model( "head", HeadSchema )

module.exports = {
    HeadModel,
    HeadSchema
}