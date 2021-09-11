const { Client, Collection, Intents } = require('discord.js');
const config = require('./config');
const { token } = require('./token.json');
const fs = require('fs');



let bot = new Client({
    fetchAllMembers: true, // Remove this if the bot is in large guilds.
    intents: [Intents.FLAGS.GUILDS], // Discord...
    presence: {
        status: 'online',
        activity: {
            name: `${config.prefix}help`,
            type: 'LISTENING',
        },
    },
});

bot.commands = new Collection();
const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // Set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        bot.once(event.name, (...args) => event.execute(...args));
    } else {
        bot.on(event.name, (...args) => event.execute(...args));
    }
}

// bot.on('ready', () => console.log(`Logged in as ${bot.user.tag}.`));

// bot.on('interactionCreate', async interaction => {
//     // If it's not a command, do nothing
//     if (!interaction.isCommand()) return;

//     const command = bot.commands.get(interaction.commandName);

//     if (!command) return;

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         await interaction.reply({ content: 'There was an error trying to execute that command!', epehemeral: true });
//     }
// });

require('./server')();
if (token == "") {
    bot.login(process.env.TOKEN);
} else {
    bot.login(token);
}