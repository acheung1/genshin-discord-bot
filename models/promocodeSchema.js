const mongoose = require('mongoose');

const promocodeSchema = new mongoose.Schema({
    rewards: {type: String, require: true},
    SEA: {type: String, require: true},
    EU: {type: String, require: true},
    NA: {type: String, require: true},
    recentlyAdded: {type: Boolean, require: true}
});

const model = mongoose.model("PromoCodeModel", promocodeSchema);
module.exports = model;