"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
class poll {
    constructor() {
        this._command = "poll";
    }
    help() {
        return "This command is for polls";
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
        let embed = new Discord.RichEmbed();
        embed.setTitle("Poll Title");
        embed.setTimestamp();
        embed.addField("This is the polling question", "these are the poll options");
        msgObject.channel.send(embed);
        const fs = require('fs');
        const readline = require('readline');
        const { google } = require('googleapis');
        const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
        const TOKEN_PATH = 'token.json';
        fs.readFile('credentials.json', (err, content) => {
            if (err)
                return console.log('Error loading client secret file:', err);
            authorize(JSON.parse(content), storeEmail);
        });
        function authorize(credentials, callback) {
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err)
                    return getNewToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token));
                callback(oAuth2Client);
            });
        }
        function getNewToken(oAuth2Client, callback) {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err)
                        return console.error('Error while trying to retrieve access token', err);
                    oAuth2Client.setCredentials(token);
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err)
                            return console.error(err);
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    callback(oAuth2Client);
                });
            });
        }
        function storeEmail(auth) {
            const sheets = google.sheets({ version: 'v4', auth });
            sheets.spreadsheets.values.get({
                spreadsheetId: '17mt-zfZQbm6YLBwhDff25e8lj2gLCglczQcM-iG8WXk',
                range: 'Polls!A2:E',
            }, (err, res) => {
                if (err)
                    return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                if (rows.length) {
                    rows.map((row) => {
                        msgObject.channel.send(`Poll question: ${row[0]}` + '\n' + `${row[1]}: ${row[2]}` + '\n' + `${row[3]}: ${row[4]}`);
                    });
                }
                else {
                    msgObject.channel.send('No data found.');
                }
            });
        }
    }
}
exports.default = poll;
