const Discord = require("discord.js"); 
const config = require("../config.json");

const embed = new Discord.MessageEmbed()
    .setTitle(`Here's a list of things I can do for you!'`)
    .addField('"**So, what do you do around here?**"','• Provide you with self-assignable roles \n • Can put you in touch with moderators \n • I also handle suspensions, kicks and auto-reporting issues with mods.')
    .setFooter('Automatically generated by Larsus')
    .setTimestamp()
    .setThumbnail('https://i.imgur.com/MpAKruf.png')
    .setColor('#1dca70')
    .addField('"**Where can I get a list of the commands?**"','You can find a comprehensive list of basic user commands in the pinned message of the *commands* channel.')

module.exports = (embed);