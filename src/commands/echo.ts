import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
        ),
    async echo(interaction: ChatInputCommandInteraction) {
        interaction.followUp({content: interaction.options.getString('input')});
    },
};
