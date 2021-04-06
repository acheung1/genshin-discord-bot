require('dotenv').config();
const subpromo = require('./subpromo');
const unsubpromo = require('./unsubpromo');
const configchannel = require('./configchannel');
const prank = require('./prank');
const wholesome = require('./wholesome');
const promocodes = require('../utilities/promocodes');

module.exports = {
    name: 'help', 
    description: 'lists out command',
    premissions: [],
    execute(client, message, args, Discord) {
        const newEmbed = new Discord.MessageEmbed()
                                .setColor("#A9A9A9")
                                .setTitle("Help")
                                .addFields(
                                    {name: 'Commands', value: `\`${process.env.PREFIX_COMMAND+subpromo.name}\`\n${subpromo.description}\n\n\`${process.env.PREFIX_COMMAND+unsubpromo.name}\`\n${unsubpromo.description}\n\n\`${process.env.PREFIX_COMMAND+configchannel.name} <new channel name>\`\n${configchannel.description}\n\n\`${process.env.PREFIX_COMMAND+prank.name}\`\n${prank.description}\n\n\`${process.env.PREFIX_COMMAND+wholesome.name}\`\n${wholesome.description}\n\n`},
                                    {name: 'Promocode Information', value: `${promocodes.description}`}
                                );
                                
        message.author.send(newEmbed);
    }
}