import { readdirSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId } from './config.json';
import { token } from './token.json';

const commands = [];
const commandFiles = readdirSync('src/commands').filter((file) =>
    file.endsWith('.js')
);


for (const file of commandFiles) {
    const new_command = `./commands/${file}`;
    try {
    commands.push(new_command.data.toJSON());
    } catch (error) {
        console.log(error);
    }
}

const rest = new REST({ version: '9' }).setToken(token);

async function testCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });
        console.log(commands)

        console.log('Successfully reloaded application (/) commands.');
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

publishCommands();
testCommands();
