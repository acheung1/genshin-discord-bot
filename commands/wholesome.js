module.exports = {
    name: 'wholesome',
    description: 'wholesome berto experience',
    premissions: [],
    async execute(client, message, args, Discord) {
        message.channel.send(`\`mfw\njust had the most wholesome coop experience in my life\nafter getting my ass whooped in numerous coop worlds\ni happened into this one group\``)
        .then(() => message.delete())
        .catch((err) => {
            console.log(err);
        });
    }
}