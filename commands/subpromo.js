const userModel = require('../models/discordUserSchema');

module.exports = {
    name: 'subpromo',
    description: 'The user who typed the command will receive notifications for new promocodes.',
    premissions: [],
    async execute(client, message, args, Discord) {
        
        const userId = message.author.id;

        if (userId) {
            userModel.exists(
                {userId: userId},
                function (err, exists) {
                    if (err) {
                    } else {
                        if (exists) {
                            message.author.send('You are already subscribed to receive new promocode notifications.')
                        } else {
                            userModel.create({userId: userId});
                            message.author.send('You have now subscribed for receiving new promocode notifications')
                        }
                    }
                });
        } else {
            message.author('Unable to subscribe you for new promocode notifications.')
        }
    }
}