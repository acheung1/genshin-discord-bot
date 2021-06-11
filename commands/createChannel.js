const serverModel = require('../models/serverSchema');

module.exports = {
    name: 'createchannel',
    description: `Creates text channel where bot can send genshin related information. Must be \`ADMINISTRATOR\` to execute command. It is recommended that the premissions do not changed for the newly created channel.`,
    premissions: ['ADMINISTRATOR'],
    async execute(client, message, args, Discord) {
        if (args.length === 0) {
            message.author.send(`Cannot have empty channel name`);
            return;
        }
        const guildId = message.guild.id;
        const channelName = args.join('-');
        const channel = message.guild.channels.cache.find(c => c.name === channelName);

        if (channel) {
            message.author.send(`Channel name: \`${channelName}\` already exist in the server.`);
            return;
        }


        message.guild.channels.create(channelName, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: message.guild.roles.everyone,
                    type: 'role',
                    allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
                    deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
                }
            ]
        }).then(() => {
            const createdChannel = message.guild.channels.cache.find(c => c.name === channelName);

            if (!createdChannel) {
                message.author.send(`Channel name: \`${channelName}\` could not be found. Try again.`);
                return;
            }
        
            serverModel.exists(
                {guildId: guildId},
                function (err, exists) {
                    if (err) {
                    } else {
                        if (exists) {
                            serverModel.updateOne(
                                {guildId: guildId}, 
                                {genshinChannelId: createdChannel.id},
                                {upsert: true},
                                function (err) {
                                    if (err) return handleError(err);
                             });
                        } else {
                            serverModel.create({guildId: guildId, genshinChannelId: createdChannel.id})
                        }
                        message.author.send(`Channel \`${channelName}\` successfully created. Please retain the current permissions if moving channel to a category.`);
                    }
                });
        }).catch((err) => {
            console.log(err);
        });
    }
}