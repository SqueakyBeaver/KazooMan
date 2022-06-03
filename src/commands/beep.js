import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('beep')
        .setDescription('Replies with Boop!'),
    async execute(interaction) {
        await interaction.reply('Boop!');
        console.log(interaction.client.listeners('messageCreate'));
    },
};
