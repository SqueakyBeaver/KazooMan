import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

exports = {
    data: new SlashCommandBuilder()
        .setName('beep')
        .setDescription('Replies with Boop!'),
    async beep(interaction: CommandInteraction) {
        await interaction.followUp('Boop!');
        console.log(interaction.client.listeners('messageCreate'));
    },
};
