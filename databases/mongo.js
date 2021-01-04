var mongoose = require("mongoose")

mongoose.connect('mongodb://localhost:27017/headsOfStateDB', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("MongoDB successfully connected!");
})

const HeadSchema = new mongoose.Schema({
    _id: { type: String },
    headOfState: { type: String, required: true }
})

const HeadModel = mongoose.model( "headsOfState", HeadSchema )

module.exports = {
    HeadModel,
    HeadSchema
}