/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId } from './config.json';
import { token } from './token.json';

// const commandFiles = readdirSync('src/commands').filter((file) =>
//     file.endsWith('.js')
// );

// I find this easier to do than a for loop
const commands = [
    require('./commands/beep.js').data.toJSON(),
    require('./commands/echo.js').data.toJSON(),
    require('./commands/join.js').data.toJSON(),
    require('./commands/ping.js').data.toJSON(),
    require('./commands/report-message.js').data,
    require('./commands/report-slash.js').data.toJSON(),
    require('./commands/speak.js').data.toJSON(),
    require('./commands/test_daily.js').data.toJSON(),
];


const rest = new REST({ version: '10' }).setToken(token);

async function testCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });
        console.log(commands);

        return console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function publishCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

// publishCommands();
testCommands();