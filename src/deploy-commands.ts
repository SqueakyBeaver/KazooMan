/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { clientId, guildId } from './config.json';
import * as dotenv from 'dotenv';

// const commandFiles = readdirSync('src/commands').filter((file) =>
//     file.endsWith('.js')
// );

// I find this easier to do than a for loop
const commandsList = [
    require('./commands/beep.js').data.toJSON(),
    require('./commands/echo.js').data.toJSON(),
    require('./commands/join.js').data.toJSON(),
    require('./commands/ping.js').data.toJSON(),
    require('./commands/report-message.js').data.toJSON(),
    require('./commands/report-slash.js').data.toJSON(),
    require('./commands/speak.js').data.toJSON(),
    require('./commands/test_daily.js').data.toJSON(),
    require('./commands/config.js').data.toJSON(),
];

// temp fix?
commandsList[8].type = 1;

dotenv.config();
const rest = new REST({ version: '10' }).setToken(String(process.env.TOKEN));

async function testCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandsList,
        });
        console.log(commandsList);

        return console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

async function publishCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(clientId), {
            body: commandsList,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

// publishCommands();
testCommands();
