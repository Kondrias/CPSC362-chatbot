"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cron = require("node-cron");
class remind {
    constructor() {
        this._command = "remind";
    }
    help() {
        return "This command sets a reminder";
    }
    isCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client) {
        try {
            msgObject.delete();
        }
        catch (exception) {
            console.log(exception);
        }
        if (args.length > 0 && this.isValidTime(args[0], msgObject)) {
            let hourminute = args[0].split(":");
            msgObject.channel.send(msgObject.author + `, I set a reminder for ${hourminute[0]}:${hourminute[1]}`);
            let reminderMessage = "Reminder: ";
            let i;
            for (i = 1; i < args.length; i++) {
                reminderMessage += args[i] + " ";
            }
            let time = `${hourminute[1]} ${hourminute[0]} * * *`;
            let reminder = Cron.schedule(time, () => {
                msgObject.author.send(`${reminderMessage}`);
                reminder.destroy();
            });
        }
        else {
            msgObject.channel.send(msgObject.author + `, your value for time (${args[0]}) is invalid. Type !help for the User Manual`);
        }
    }
    isValidTime(time, msg) {
        if (time.length < 3 || time.length > 5) {
            return false;
        }
        if (!(time.includes(":"))) {
            return false;
        }
        let hourminute = time.split(":");
        if (!(hourminute.length === 2)) {
            return false;
        }
        if (!(/^\d+$/.test(hourminute[0]))) {
            return false;
        }
        if (!(/^\d+$/.test(hourminute[1]))) {
            return false;
        }
        if (parseInt(hourminute[0]) < 0 || parseInt(hourminute[0]) > 23) {
            return false;
        }
        if (parseInt(hourminute[1]) < 0 || parseInt(hourminute[1]) > 59) {
            return false;
        }
        return true;
    }
}
exports.default = remind;
