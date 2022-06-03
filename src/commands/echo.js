import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
        ),
    async execute(interaction) {
        interaction.reply(interaction.options.getString('input'));
    },
};
