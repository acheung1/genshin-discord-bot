const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    genshinChannelId: {type: String},
    guildId: {type: String, require: true},
    promocodeMessageId: {type: String}
});

const model = mongoose.model("ServerModel", serverSchema);
module.exports = model;