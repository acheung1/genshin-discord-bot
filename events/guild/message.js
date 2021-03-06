//const profileModel = require('../../models/profileSchema');

require('dotenv').config();

const cooldown = new Map();


module.exports = async(Discord, client, message) => {
    const prefix = process.env.PREFIX_COMMAND;

    if (!message.content.startsWith(process.env.PREFIX_COMMAND) || message.author.bot) {
        return;
    }

   /*  let profileData;
    try {
        profileData = await profileModel.findOne({ userId: message.author.id });
        
        if (!profileData) {
            console.log('existed');
            let profile = await profileModel.create({
                userId: message.author.id,
                serverId: message.guild.id,
                coins:1000,
                bank: 0
            });
            profile.save();
        }
    } catch (err) {
        console.log(err);
    } */

    const args = message.content.slice(process.env.PREFIX_COMMAND.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases&& a.aliases.includes(cmd));

    const validPermissions = [
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "ADMINISTRATOR",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS",
      ];

    if (command) {
        if (command && command.premissions && command.premissions.length) {
            let invalid_prem = [];
            for (const prem of command.premissions) {
                if (!validPermissions.includes(prem)) {
                    return console.log(`Invalid permissions ${prem}`);
                }

                if (!message.member.hasPermission(prem)) { 
                    invalid_prem.push(prem);
                }
            }
            if (invalid_prem.length) {
                return message.channel.send(`Missing premissions \`${invalid_prem}\``);
            }
        }

        if (!cooldown.has(command.name)) {
            cooldown.set(command.name, new Discord.Collection());
        }

        const curr_time = Date.now();
        const time_stamp = cooldown.get(command.name);
        const cooldown_amount = (command.cooldown) * 1000

        if (time_stamp.has(message.author.id)) {
            const expiration_time = time_stamp.get(message.author.id) + cooldown_amount;
            if (curr_time < expiration_time) {
                const time_left = (expiration_time - curr_time) / 1000;
                return message.reply(`Time remaining ${time_left.toFixed(1)} seconds for command: ${command.name}`);
            }
        }

        time_stamp.set(message.author.id, curr_time);
        setTimeout(() => time_stamp.delete(message.author.id), cooldown_amount);
        try {
            command.execute(client, message, args, Discord);
        } catch (err) {
            message.reply("Errror executing command");
            console.log(err);
        }
    }
}
