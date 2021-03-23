module.exports = {
    name: 'wholesome',
    description: 'wholesome berto experience',
    premissions: [],
    async execute(client, message, args, Discord) {
        // TODO: stills activates after -wholesome g
        var hidden = args && args.length === 1 && args[0] === 'h';
        if ((args && args.length === 0) || hidden) {
            message.channel.send(`\`mfw\njust had the most wholesome coop experience in my life\nafter getting my ass whooped in numerous coop worlds\ni happened into this one group\``)
            .then(() => {
                if (hidden) {
                    message.delete();
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    }
}