import * as Discord from "discord.js";
import * as Cron from "node-cron";
import {IBotCommand} from "../api";
import { createConnection } from "net";

export default class remind implements IBotCommand
{
    private readonly _command = "remind";

    help(): string {
        return "This command sets a reminder";
    } 

    isCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void {
        try
        {
            msgObject.delete(); //deletes user's message for privacy purposes
        }
        catch (exception)
        {
            console.log(exception);
        }

        if (args.length > 0 && this.isValidTime(args[0], msgObject)) //check if time input is valid
        {
            //breaks time argument into hourminute[0] for hours and hourminute[1] for minutes
            let hourminute = args[0].split(":"); 
            msgObject.channel.send(msgObject.author + `, I set a reminder for ${hourminute[0]}:${hourminute[1]}`);
    
            //Create reminder message from remaining arguments
            let reminderMessage = "Reminder: ";
            let i;
            for (i = 1; i < args.length; i++)
            {
                reminderMessage += args[i] + " ";
            }

            //node-cron job to schedule the reminder. Deletes task after execution.
            let time = `${hourminute[1]} ${hourminute[0]} * * *`;
            let reminder = Cron.schedule(time, ()=> {
                msgObject.author.send(`${reminderMessage}`);
                reminder.destroy();
            });
        }
        else
        {
            msgObject.channel.send(msgObject.author + `, your value for time (${args[0]}) is invalid. Type !help for the User Manual`);
        }
    }

    isValidTime(time: string, msg: Discord.Message): boolean {
        if (time.length < 3 || time.length > 5) {return false;} //should only be at least 3 and at most 5 characters long
        if (!(time.includes(":"))) {return false;} //must have a ':' separator

        //breaks time argument into hourminute[0] for hours and hourminute[1] for minutes
        let hourminute = time.split(":");
        if (!(hourminute.length === 2)) {return false;} //too many values to be a time

        if(!(/^\d+$/.test(hourminute[0]))) {return false;} //hours value is not a number
        if(!(/^\d+$/.test(hourminute[1]))) {return false;} //minutes value is not a number

        if (parseInt(hourminute[0]) < 0 || parseInt(hourminute[0]) > 23) {return false;} //hours value out of bounds
        if (parseInt(hourminute[1]) < 0 || parseInt(hourminute[1]) > 59) {return false;} //minutes value out of bounds

        //is valid time if passes all error checks
        return true;
    }
}