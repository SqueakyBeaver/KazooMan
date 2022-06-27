/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import * as dotenv from 'dotenv';
import clc from 'cli-color';

import { DBInstance } from './db/database.js';

export const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    presence: {
        status: 'online',
        activities: [
            {
                name: 'HJONK',
                type: 'PLAYING'
            }
        ]
    }
});

export const commandsList: Collection<string, string> = new Collection<string, string>()
    // In the interaction handler, we will do some fancy stuff
    // Split vals by space, require file, exec function
    // Normal slash commands
    .set('beep', './commands/beep.js beep')
    .set('echo', './commands/echo.js echo')
    .set('join', './commands/join.js join')
    .set('ping', './commands/ping.js ping')
    .set('report', './commands/report-slash.js report')
    .set('speak', './commands/speak.js speak')
    .set('test_daily', './commands/test_daily.js testDaily')
    // Context menus
    .set('Report Message', './commands/report-message.js report')
    // Subcommands; in interaction handler, we will 
    // select the function with the name of the subcommand
    .set('config', './commands/config.js');

export const database = new DBInstance();

if (require.main === module) {
    dotenv.config();

    bot.login(process.env.TOKEN)
        .then(_ => console.log(clc.cyan('Logged in')))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
    const eventFiles = readdirSync('gen/events').filter((file) =>
        file.endsWith('.js')
    );

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            bot.once(event.name, (...args) => event.execute(...args));
        } else {
            bot.on(event.name, (...args) => event.execute(...args));
        }
    }
    
    database.init().then( _ => console.log(clc.green('Database initialized')));

    // require('./server')();
}
