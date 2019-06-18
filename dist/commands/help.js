"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
class help {
    constructor() {
        this._command = "help";
    }
    help() {
        return "This command outputs the user manual";
    }
    isCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client) {
        let embed = new Discord.RichEmbed();
        embed.setTitle("User Manual:");
        embed.addField("!help", "use this command to bring up the user manual");
        embed.addField("!remind", "Use this command to set up a reminder");
        embed.addField("!question", "Use this command if you have a question for us");
        embed.addField("!subscribe", "Use this command to subscribe to our mailing list");
        embed.addField("!poll", "Use this command for our polls");
        msgObject.channel.send(embed);
    }
}
exports.default = help;
