const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
require('dotenv').config();
const mongoose = require('mongoose');
const promoCodes = require('./utilities/promocodes')


const fs = require('fs');
const promocodes = require('./utilities/promocodes');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
})

mongoose
    .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    userFindAndModify: false
}).then(()=>  {
    console.log('Connected to database.');
}).catch((err) => {
    console.log(err);
});

setInterval(function() {

    promoCodes.updatePromocodesDB().then(
        promoCodes.updatePromocodeInfo(client, Discord).then(
            promocodes.newPromocodeUpdate(client, Discord)
        ) 
    );
}, (1000 * 60) * process.env.INTERVAL_UPDATE_MINUTES);

client.login(process.env.DISCORD_TOKEN);