const userModel = require('../models/discordUserSchema');

module.exports = {
    name: 'unsubpromo',
    description: 'The user who typed the command will no longer received notifications for new promocodes.',
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
                            userModel.deleteOne({userId: userId}).then(result => {

                            });
                            message.author.send('You have been unsubscribed from receiving new promocode notifications')
                        } else {
                            message.author.send('You are currently subscribed to received new promocode notifications.')

                        }
                    }
                });
        } else {
            message.author('Unable to unsubscribed you from receving new promocode notifications.')
        }
    }
}