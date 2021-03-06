const mongoose = require('mongoose');

const primocodeSchema = new mongoose.Schema({
    dateAdded: {type: String, require: true},
    rewards: {type: String, require: true},
    expired: {type: Boolean, require: true},
    codes: {
            SEA: {type: String, require: true},
            US: {type: String, require: true},
            EU: {type: String, require: true},
            require: true,
            unique: true
    }

});

const model = mongoose.model("PrimoCodeModels",primocodeSchema);
module.exports = model;