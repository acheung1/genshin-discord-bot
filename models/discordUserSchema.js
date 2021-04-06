const mongoose = require('mongoose');

const discordUserSchema = new mongoose.Schema({
    userId: {type: String, require: true}
});

const model = mongoose.model("DiscordUserModel", discordUserSchema);
module.exports = model;