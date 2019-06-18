import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class help implements IBotCommand
{
    private readonly _command = "help";

    help(): string {
        return "This command outputs the user manual";
    } 

    isCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void {
        //if argument exists do not display default manual
        let embed = new Discord.RichEmbed();
        embed.setTitle("User Manual:");
        embed.addField("!help", "use this command to bring up the user manual");
        embed.addField("!remind", "Use this command to set up a reminder");
        embed.addField("!question", "Use this command if you have a question for us");
        embed.addField("!subscribe", "Use this command to subscribe to our mailing list");
        embed.addField("!poll", "Use this command for our polls");
        msgObject.channel.send(embed);
 
        //if argument for help display helpCommand.help(); 
        //this displays the detailed information on parameters and arguments
    }
}