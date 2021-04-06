const htmlEntity = require('html-entities');
const promocodeModel = require('../models/promocodeSchema');
const serverModel = require("../models/serverSchema");
const userModel = require("../models/discordUserSchema");
require("dotenv").config();
const request = require("request");
const configchannel = require("../commands/configchannel");

module.exports = {
    description: `After genshin channel is created in your server after \`${process.env.PREFIX_COMMAND+configchannel.name}\`, 
        the bot will automically edit the embeded message on a regular interval. If the embeded message is not found, a new one will be created and then be regulary updated.\n
        Users who are subscribed to recevied new promocode notifications will be DM by the bot sometime after a new promocode is known.`,
    // updates promocode collection
    async updatePromocodesDB() {
		request({
				uri: "https://www.gensh.in/events/promotion-codes"
			},
			function (error, response, body) {
				const re = /<td>(.*?)<\/td>/g;
				const found = body.match(re, "$1");
				var newCode = false;
				var i = 0;

				while (i < found.length) {
					found[i] = htmlEntity.decode(found[i]).replace(re, "$1").trim();
					i++;
				}
				i = 0;

				while (i < found.length) {
					const rewards = found[i + 1];
					const codeEU = found[i + 3];
					const codeNA = found[i + 4];
					const codeSEA = found[i + 5];
					const expired = found[i + 2].toLowerCase().includes("yes") ? true : false;

					promocodeModel.exists({
							SEA: codeSEA,
							EU: codeEU,
							NA: codeNA,
						},
						function (err, exists) {
							if (err) {
								console.log("error found:" + err);
							} else {
								if (exists) {
									if (expired) {
										promocodeModel.deleteMany({
												SEA: codeSEA,
												EU: codeEU,
												NA: codeNA,
											},
											function (err) {
												if (err) return handleError(err);
											}
										);
									}
								} else if (!exists) {
									if (!expired) {
										newCode = true;
										promocodeModel.create({
											rewards: rewards,
											NA: codeNA,
											EU: codeEU,
											SEA: codeSEA,
                                            recentlyAdded: true
										});
									}
								}
							}
						}
					);
					i = i + 6;
				}
			}
		);
	},

    // updates promoCode info for all server
    async updatePromocodeInfo(client, Discord) {
        serverModel.find({}, function (err, servers) {
            if (err) {
                console.log("error found: " + err);
            } else {
                servers.forEach((server) => {
                    const guildId = server.guildId;
                    const channelId = server.genshinChannelId;
                    const messageId = server.promocodeMessageId;
                    const guild = client.guilds.cache.find(g => g.id === guildId);

                    if (!guild) {
                        return;
                    }

                    const channel = guild.channels.cache.find(c => c.id === channelId);

                    if (channel) {
                        var currentTime = new Date();
                        const newEmbed = new Discord.MessageEmbed()
                            .setColor("#FFA500")
                            .setTitle("Promocodes Information")
                            .setThumbnail('https://static.wikia.nocookie.net/gensin-impact/images/d/d4/Item_Primogem.png/revision/latest/scale-to-width-down/256?cb=20201117071158')
                            .setURL("https://genshin.mihoyo.com/en/gift")
                            .setDescription("Click on link above to redeem.\nCurrently tracking non-expired promocodes.\n")
                            .setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Genshin_Impact_logo.svg/1920px-Genshin_Impact_logo.svg.png")
                            .addFields(
                                {name: 'Available Codes', value: `Data is pulled from gensh.in.`}
                            )
                            .setFooter(
                                `Last updated: ${currentTime.toLocaleString("en-US", {timeZone: process.env.TIME_ZONE})} ${process.env.TIME_ZONE}`);
                            
                            promocodeModel.find({}, function (err, promoCodes) {
                                if (err) {
                                    console.log("error found: " + err);
                                } else {
                                    newCodes = [];
                                    if (!promoCodes || (promoCodes && promoCodes.length === 0)) {
                                        newEmbed.addFields({
                                            name: 'Could not find any non-expired promocode',
                                            value: '😞'
                                        });
                                    }
                                    promoCodes.forEach((entry) => {
                                        newEmbed.addFields(
                                            {
                                                name: `North America: ${entry.NA}\nEurope: ${entry.EU}\nSouth East Asia: ${entry.SEA}`,
                                                value: `Rewards: ${entry.rewards}`
                                            }
                                        )
                                    });
                                    channel.messages.fetch(messageId).then((promoMessage) => {
                                        if (promoMessage && !(promoMessage.id === undefined)) {
                                            promoMessage.edit(newEmbed);
                                        } else {
                                            channel.send(newEmbed).then((msg) => {
                                                serverModel.updateOne(
                                                                 {guildId: guildId}, 
                                                                 {promocodeMessageId: msg.id},
                                                                 {upsert: true},
                                                                 function (err) {
                                                                    if (err) return handleError(err);
                                                             });
                                            });
                                        }
                                    }).catch((err) => {
                                        channel.send(newEmbed).then((msg) => {
                                            serverModel.updateOne(
                                                             {guildId: guildId}, 
                                                             {promocodeMessageId: msg.id},
                                                             {upsert: true},
                                                             function (err) {
                                                                if (err) return handleError(err);
                                                         });
                                        });
                                    });
                                    
                                }
                            });       
                    }
                });

            }
        });
	},

    // notifies users of recently added promocodes
    async newPromocodeUpdate(client, Discord) {
        promocodeModel.find({recentlyAdded: true}, function (err, promoCodes) {
                if (err) {
                    console.log("error found: " + err);
                } else if (promoCodes.length > 0){        
                    var newCodes = [];
                    promoCodes.forEach((entry) => {
                        newCodes.push({
                            NA: entry.NA,
                            EU: entry.EU,
                            SEA: entry.SEA,
                            rewards: entry.rewards
                        });
                    });
                    userModel.find({}, function (err, users) {
                        if (err) {
                            console.log("error found: " + err);
                        } else {
                            var currentTime = new Date();
                            const newCodeEmbed = new Discord.MessageEmbed()
                                .setColor("#FFA500")
                                .setTitle("New Promocode(s) found")
                                .setThumbnail('https://static.wikia.nocookie.net/gensin-impact/images/d/d4/Item_Primogem.png/revision/latest/scale-to-width-down/256?cb=20201117071158')
                                .setURL("https://genshin.mihoyo.com/en/gift")
                                .setDescription("Click on link above to redeem")
                                .setFooter(
                                    `Retrieved: ${currentTime.toLocaleString("en-US", {timeZone: process.env.TIME_ZONE})} ${process.env.TIME_ZONE}`);
                            newCodes.forEach((code) => {
                                    newCodeEmbed.addFields({name: `NA: ${code.NA}\nEU: ${code.EU}\nSEA: ${code.SEA}`, value: `${code.rewards}`});
                                }
                            );
                            users.forEach((user) => { 
                            const discordUser =  client.users.cache.find(u => u.id === user.userId);
                            if (discordUser) {
                                    discordUser.send(newCodeEmbed);
                            }
                            });

                            promocodeModel.updateMany({recentlyAdded: true}, {recentlyAdded: false}, {upsert: true},
                                function (err) {
                                    if (err) return handleError(err);
                             });
                        }
                    });
                }
        });
    }
    
}
