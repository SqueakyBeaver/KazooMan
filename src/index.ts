/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, Intents } from 'discord.js';
import { token } from './token.json';
import { readdirSync } from 'fs';

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
    .set(require('./commands/beep.js').data.name, require('./commands/beep.js'))
    .set(require('./commands/echo.js').data.name, require('./commands/echo.js'))
    .set(require('./commands/join.js').data.name, require('./commands/join.js'))
    .set(require('./commands/ping.js').data.name, require('./commands/ping.js'))
    .set('Report Message', require('./commands/report-message.js'))
    .set(require('./commands/report-slash.js').data.name, require('./commands/report-slash.js'))
    .set(require('./commands/speak.js').data.name, require('./commands/speak.js'))
    .set(require('./commands/test_daily.js').data.name, require('./commands/test_daily.js'));


export { bot, commands };
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

    // require('./server')();

    if (token === '') {
        bot.login(process.env.TOKEN);
    } else {
        bot.login(token);
    }
}