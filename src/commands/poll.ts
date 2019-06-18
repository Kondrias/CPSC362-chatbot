import * as Discord from "discord.js";
import {IBotCommand} from "../api";

export default class poll implements IBotCommand
{
    private readonly _command = "poll";

    help(): string {
        return "This command is for polls";
    } 

    isCommand(command: string): boolean {
        return command === this._command;
    }

    runCommand(args: string[], msgObject: Discord.Message, client: Discord.Client): void {
        try
        {
            msgObject.delete(); //deletes user's message to reduce spam
        }
        catch (exception)
        {
            console.log(exception);
        }
        let embed = new Discord.RichEmbed();
        embed.setTitle("Poll Title");
        embed.setTimestamp();
        embed.addField("This is the polling question", "these are the poll options")
        msgObject.channel.send(embed);


        
//This stuff is for reading data from google sheets
//-----------------------------------------------------------------
//          Google Sheets Example Code
//------------------------------------------
//start of login code for google sheets
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err: any, content: any) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  


//----------------------------------------------------------------------------------------
  authorize(JSON.parse(content), storeEmail); // THIS IS WHERE YOU ADD FUNCTIONS TO RUN
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials: any, callback: any) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err: any, token: any) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client: any, callback: any) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code: any) => {
    rl.close();
    oAuth2Client.getToken(code, (err: any, token: any) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err: any) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
// end of log in code for google sheets



/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/17mt-zfZQbm6YLBwhDff25e8lj2gLCglczQcM-iG8WXk/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function storeEmail(auth: any) {
    const sheets = google.sheets({version: 'v4', auth});
    //retrieve values from google sheets
    //target sheet is spreadsheetId
    //target content range is range
    //range : 'SheetName!StartRange:EndRange
    sheets.spreadsheets.values.get({
      spreadsheetId: '17mt-zfZQbm6YLBwhDff25e8lj2gLCglczQcM-iG8WXk',
      range: 'Polls!A2:E',
    }, (err: any, res: any) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
        // Print columns A and b, which correspond to indices 0 and 1.
        rows.map((row: any) => {
          msgObject.channel.send(`Poll question: ${row[0]}` + '\n' + `${row[1]}: ${row[2]}` + '\n' + `${row[3]}: ${row[4]}`);
        });
      } else {
        msgObject.channel.send('No data found.');
      }
    });
  }
    }  





}