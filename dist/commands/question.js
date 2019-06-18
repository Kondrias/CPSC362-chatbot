"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
class question {
    constructor() {
        this._command = "question";
    }
    help() {
        return "This command outputs FAQs";
    }
    isCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client) {
        let embed = new Discord.RichEmbed();
        embed.setTitle("Frequently Asked Questions:");
        embed.addField("Who?", "Ryan Chen, Christian Jimenez, and Daniel Pestolesi");
        embed.addField("What?", "Discord Chat Bot");
        embed.addField("Where?", "California State University, Fullerton");
        embed.addField("When?", "Summer Session A, 2019");
        embed.addField("Why?", "Project for CPSC 362");
        embed.setFooter("Use this unimplemented command for any additional questions!");
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
            var values = [
                [
                    `${msgObject.author.username}`, "Testquestion"
                ],
            ];
            var body = {
                values: values
            };
            sheets.spreadsheets.values.append({
                spreadsheetId: '17mt-zfZQbm6YLBwhDff25e8lj2gLCglczQcM-iG8WXk',
                range: 'Questions!A2:B',
                valueInputOption: 'RAW',
                resource: body
            }).then((response) => {
                var result = response.result;
                msgObject.channel.send("success");
            });
        }
    }
}
exports.default = question;
