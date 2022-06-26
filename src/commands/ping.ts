import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('See the ping of the bot.'),
    async ping(interaction: CommandInteraction) {
        await interaction.followUp(
            `Pong! It took me ${Math.round(
                interaction.client.ws.ping
            )}ms to get that.`
        );
    },
};
