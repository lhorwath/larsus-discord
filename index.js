//Imports

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const command = require('./command');

const helpEmbed = require('./embeds/helpEmbed');
const welcomeEmbed = require('./embeds/welcomeEmbed');

const serverInfo = require('./serverinfo.json'); //Server specific channels and roles ID and names

//Commands

client.on('ready', () => {
    console.log('BOT: Larsus - Succesful log-in')

    //General commands

    command(client, ['help','helpme','Help','Helpme'], (message) => { //Help command
        if (message.author.bot) return;

        const userId = message.author.id;

        message.channel.send('Hey there <@'+userId+'>! I heard you needed help!');
        message.channel.send(helpEmbed);
    });

    command(client, ['cc','clearall'], (message) => { //clear all messages in channel command
        if (message.author.bot) return;

        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then(results => {
                message.channel.bulkDelete(results);
            })
        }
    });

    command(client, 'status', message => { //bot status command
        if (message.author.bot) return;

        const content = message.content.replace('!status', '');

        if (message.member.hasPermission('ADMINISTRATOR') && !message.author.bot) {
            client.user.setPresence({
                activity: {
                    name: content,
                    type: 0,
                },
            });
        }
    });

    //Roles commands

    command(client, ['she','She'], message => { //Command to self-assign a "She/Her" role
        if (message.author.bot) return;

        const channelbot = serverInfo.bot_channel;
        const channeldebug = serverInfo.debug_channel;
        if (message.channel.id == channelbot || message.channel.id == channeldebug){
            if (message.member.roles.cache.has(serverInfo.role_she)){
                message.reply('You already had the "She" role. Removed it!');
                message.member.roles.remove(serverInfo.role_she);
            } else {
                message.reply('Added the "She" role!');
                message.member.roles.add(serverInfo.role_she);
            }
        }
    });

    command(client, ['they','They'], message => { //Command to self-assign a "They/Them" role
        if (message.author.bot) return;

        const channelbot = serverInfo.bot_channel;
        const channeldebug = serverInfo.debug_channel;
        if (message.channel.id == channelbot || message.channel.id == channeldebug){
            if (message.member.roles.cache.has(serverInfo.role_they)){
                message.reply('You already had the "They" role. Removed it!');
                message.member.roles.remove(serverInfo.role_they);
            } else {
                message.reply('Added the "They" role!');
                message.member.roles.add(serverInfo.role_they);
            }
        }
    })

    command(client, ['he','He'], message => { //Command to self-assign a "He/Him" role
        if (message.author.bot) return;
    
        const channelbot = serverInfo.bot_channel;
        const channeldebug = serverInfo.debug_channel;
        if (message.channel.id == channelbot || message.channel.id == channeldebug){
            if (message.member.roles.cache.has(serverInfo.role_he)){
                message.reply('You already had the "He" role. Removed it!');
                message.member.roles.remove(serverInfo.role_he);
            } else {
                message.reply('Added the "He" role!');
                message.member.roles.add(serverInfo.role_he);
            }
        }
    })

    //Moderation commands

    command(client,['kick','Kick'],message => { //Kick
        if (message.author.bot) return;
        if (!message.member.hasPermission('KICK_MEMBERS')) return;

        const user = message.content.substring().split(" ").slice(1,2).join(" ");
        const reason = message.content.substring().split(" ").slice(2).join(" ");

        const channelOutput = client.channels.cache.find(channel => channel.id === serverInfo.userlogs_channel);
       
        const targetId = client.users.cache.find(u => u.tag === user).id;
        const target = message.guild.members.cache.get(targetId);

        if(!target){
            message.reply('Sorry I could not find that user.')

        } if(!reason){
            message.reply('Sorry, please give me a reason to kick this user.')

        } else {
          
            const kick_embed = new Discord.MessageEmbed()
                .setTitle("**You have been kicked**")
                .setColor('#1dca70')
                .setFooter('Automatically generated by Larsus')
                .setTimestamp()
                .setDescription("You have been kicked from the server for the following reason(s): " + reason + '\n \n Kicks are temporary and constitute a warning; repeat offense may result in a ban. There is no need to appeal to this suspension.')

            try{ //tries to send a DM informing the user they have been kicked
                client.users.cache.get(targetId).send(kick_embed).then(message => {
                    target.kick();
                })
            } catch (err){
                target.kick();
                message.reply('I could not contact the user.');
            }

            channelOutput.send('User has been kicked from the server: <@'+targetId+'> for the following reason: '+reason);
            message.reply('User succesfully kicked.');
        }


    })

    command(client,['ban','Ban'],message => { //Bans a user
        if (message.author.bot) return;
        if (!message.member.hasPermission('BAN_MEMBERS')) return;

        const user = message.content.substring().split(" ").slice(1,2).join(" ");
        const reason = message.content.substring().split(" ").slice(2).join(" ");

        const channelOutput = client.channels.cache.find(channel => channel.id === serverInfo.userlogs_channel);
       
        const targetId = client.users.cache.find(u => u.tag === user).id;
        const target = message.guild.members.cache.get(targetId);

        if(!target){
            message.reply('Sorry I could not find that user.')

        } if(!reason){
            message.reply('Sorry, please give me a reason to ban this user.')

        } else {
          
            const ban_embed = new Discord.MessageEmbed()
                .setTitle("**You have been banned**")
                .setColor('#1dca70')
                .setFooter('Automatically generated by Larsus')
                .setTimestamp()
                .setURL('https://docs.google.com/forms/d/e/1FAIpQLScCaXdyvKWm4oWHfxlm64MMDxG3DjnZmOhXnBfMKjNTnB9J6Q/viewform?usp=sf_link')
                .setDescription("You have been banned from the server for the following reason(s): " + reason + '\n \n Bans are permanent unless appealed. \n \n You may appeal the ban by following the link provided and filing a form.')

            try{ //tries to send a DM informing the user they have been kicked
                client.users.cache.get(targetId).send(ban_embed).then(message => {
                    target.ban();
                })
            } catch (err){
                target.ban();
                message.reply('I could not contact the user.');
            }

            channelOutput.send('User has been banned from the server: <@'+targetId+'> for the following reason: '+reason);
            message.reply('User succesfully banned.');
        }


    })

    command(client,['permaban','Permaban'],message => { //Bans a user
        if (message.author.bot) return;
        if (!message.member.hasPermission('BAN_MEMBERS')) return;

        const user = message.content.substring().split(" ").slice(1,2).join(" ");
        const reason = message.content.substring().split(" ").slice(2).join(" ");

        const channelOutput = client.channels.cache.find(channel => channel.id === serverInfo.userlogs_channel);
       
        const targetId = client.users.cache.find(u => u.tag === user).id;
        const target = message.guild.members.cache.get(targetId);

        if(!target){
            message.reply('Sorry I could not find that user.')

        } if(!reason){
            message.reply('Sorry, please give me a reason to ban this user.')

        } else {
          
            const ban_embed = new Discord.MessageEmbed()
                .setTitle("**You have been permanently banned**")
                .setColor('#1dca70')
                .setFooter('Automatically generated by Larsus')
                .setTimestamp()
                .setDescription("You have been banned from the server for the following reason(s): " + reason + '\n \n Bans are permanent unless appealed. \n \n You may not appeal this ban.')

            try{ //tries to send a DM informing the user they have been kicked
                client.users.cache.get(targetId).send(ban_embed).then(message => {
                    target.ban();
                })
            } catch (err){
                target.ban();
                message.reply('I could not contact the user.');
            }

            channelOutput.send('User has been permanently banned from the server: <@'+targetId+'> for the following reason: '+reason);
            message.reply('User succesfully permanently banned.');
        }


    })

})

//Non-command runs

client.on('guildMemberAdd', member => { //Welcome new users
    const userId = member.id;
    const channelArrival = client.channels.cache.find(channel => channel.id === serverInfo.arrivals_channel);
    const channelOutput = client.channels.cache.find(channel => channel.id === serverInfo.userlogs_channel);

    channelArrival.send('Hey there <@'+userId+'>! Please check the message below for information on the server!');
    channelArrival.send(welcomeEmbed);

    channelOutput.send('New user logged in: <@'+userId+'> with the following ID: '+userId);
})

client.on('guildMemberRemove', member => { //Log users who left
    const channelOutput = client.channels.cache.find(channel => channel.id === serverInfo.userlogs_channel);
    const userId = member.id;

    channelOutput.send('User has left the server: <@'+userId+'> with the following ID: '+userId);
})

client.on('message', message => { //Test for Agree
    if (message.content === ('!Agree') && message.channel.id == serverInfo.rules_channel){ //checks for requirements
            if (!message.member.roles.cache.has(serverInfo.role_base) && !message.member.hasPermission('ADMINISTRATOR')){ //If the message owner does not have the role and isn't and admin
                message.member.roles.add(serverInfo.role_base);
                message.delete({ timeout: 500 })
            } else { //Deletes the message
                message.member.roles.add(serverInfo.role_base);     
            }   
    }

    if (!message.member.hasPermission('ADMINISTRATOR') && message.channel.id == serverInfo.rules_channel){ //Deletes any message by a non-admin in the rules channel to avoid spam
        message.delete({ timeout: 500 })
    }
})

//Login bot

client.login(config.token);