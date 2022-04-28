import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beep')
        .setDescription('Replies with Boop!'),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('Boop!');
        console.log(interaction.client.listeners('messageCreate'));
    },
};
