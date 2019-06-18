"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class subscribe {
    constructor() {
        this._command = "subscribe";
    }
    help() {
        return "This command subscribes an email";
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
        msgObject.channel.send(msgObject.author + ` subscribed to our emailing list!`);
        msgObject.author.send("I sent you an email (not really)");
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
                    `${msgObject.author.username}`, "TestEmail"
                ],
            ];
            var body = {
                values: values
            };
            sheets.spreadsheets.values.append({
                spreadsheetId: '17mt-zfZQbm6YLBwhDff25e8lj2gLCglczQcM-iG8WXk',
                range: 'Emailing List!A2:B',
                valueInputOption: 'RAW',
                resource: body
            }).then((response) => {
                var result = response.result;
                msgObject.channel.send("success");
            });
        }
    }
}
exports.default = subscribe;
