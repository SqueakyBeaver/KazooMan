import { Client, Collection, Intents } from 'discord.js';
import token from './token.json' assert {type: 'json'};
import fs from 'fs';
import { server } from './server.js';


export const bot = new Client({
    // fetchAllMembers: true, // Remove this if the bot is in large guilds.
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES], // Discord...
    presence: {
        status: 'online',
    },
});


bot.commands_list = new Collection();
const commandFiles = fs
    .readdirSync('src/commands')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = `./commands/${file}`;
    // Set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands_list.set(command?.data?.name, command);
}

const eventFiles = fs
    .readdirSync('src/events')
    .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = `./events/${file}`;
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args));
    } else {
        bot.on(event.name, (...args) => event.execute(...args));
    }
}

server();
if (token.token == '') {
    bot.login(process.env.TOKEN);
} else {
    bot.login(token.token);
}
