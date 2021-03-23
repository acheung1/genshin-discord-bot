module.exports = {
    name: 'prank',
    description: '*fanfare* You\'ve been pranked!',
    premissions: [],
    async execute(client, message, args, Discord) {
        message.channel.send({files: ["./resources/images/youbeenpranked.png"]}) 
        .catch((err) => {
            console.log(err);
        });

    }
}