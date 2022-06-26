/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, Intents } from 'discord.js';
import { readdirSync } from 'fs';
import * as dotenv from 'dotenv';

import { DBInstance } from './db/database';

const bot = new Client({
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

// I find this easier to do than a for loop


const commands = new Collection()
    .set('beep', require('./commands/beep.js'))
    .set('echo', require('./commands/echo.js'))
    .set('join', require('./commands/join.js'))
    .set('ping', require('./commands/ping.js'))
    .set('Report Message', require('./commands/report-message.js'))
    .set('report', require('./commands/report-slash.js'))
    .set('speak', require('./commands/speak.js'))
    .set('test_daily', require('./commands/test_daily.js'));

const database = new DBInstance();

export { bot, commands, database };

if (require.main === module) {
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
    
    database.init().then( _ => console.log('database initialized'));

    // require('./server')();
    dotenv.config();

    bot.login(process.env.TOKEN);
}