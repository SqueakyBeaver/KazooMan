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
const commands = new Collection();

const commandFiles = readdirSync('src/commands').filter((file) =>
    file.endsWith('.js')
);

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // with the key as the command name and the value as the exported module
    commands.set(command.data.name, command);
}

export { bot, commands };

const eventFiles = readdirSync('src/events').filter((file) =>
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
