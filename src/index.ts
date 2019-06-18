// Authors: Ryan Chen
// California State University, Fullertion
// CPSC 362 Summer Session A
// This program is a Discord bot developed for the group project
// Date Created: 6/16/2019
// Last modified: 6/16/2019

import * as Discord from "discord.js";
import * as ConfigFile from "./config";
//import * as cron from "node-cron"; cron import may remove later not used in main.
import {IBotCommand} from "./api";
import help from "./commands/help";

const bot: Discord.Client = new Discord.Client();
let commands: IBotCommand[] = [];

loadCommands(`${__dirname}/commands`)

bot.on("ready", ()=>{
    //Let us know that the bot is online
    console.log("Greetings fellow humans!");
    

})

//This is where the bot listens to messages from Discord
bot.on("message", msg => {
    //Ignore the message if it was sent by the bot
    if(msg.author.bot) 
    {
        return;
    }

    //Ignore messages that do not start with the prefix
    if(!msg.content.startsWith(ConfigFile.config.prefix)) 
    {
        return;
    }

    //Debug Purposes
    //Send a message when a command is used 
    //msg.channel.send(`${msg.author.username} used a command!`);

    //handle commands
    handleCommand(msg)
})

async function handleCommand(msg: Discord.Message)
{
    //split the string into command and args
    let command = msg.content.split(" ")[0].replace(ConfigFile.config.prefix, "");
    let args = msg.content.split(" ").slice(1);

    //loop through list of commands until find correct command
    for (const commandClass of commands)
    {
        try
        {
            //go to next loop iteration if not the correct command
            if(!commandClass.isCommand(command))
            {
                continue;
            }
            
            //wait for command code to run and terminate function
            await commandClass.runCommand(args, msg, bot);
            return;
        }
        catch (exception)
        {
            //Log any errors and run user manual command
            console.log(exception);
        }
    }
    //correct command could not be found, default to help command
    const helpCommand: help = new help();
    msg.channel.send("That is not a valid command. Please refer to the user manual");
    helpCommand.runCommand(args, msg, bot);
    helpCommand.help();
}

function loadCommands(commandsPath: string)
{
    //exit if there are no commands
    if (!ConfigFile.config.commands || (ConfigFile.config.commands as string[]).length === 0)
    {
        return;
    }

    //loop through all of the commands in config file
    for (const commandName of ConfigFile.config.commands as string[])
    {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;

        const command = new commandsClass() as IBotCommand;

        commands.push(command);
    }
}

//Logs the bot into the server on run of Javascript file.
//To run the bot, open ./dist/index.js in terminal and type node .
bot.login(ConfigFile.config.token);