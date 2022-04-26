const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beep')
        .setDescription('Replies with Boop!'),
    async execute(interaction) {
        await interaction.reply('Boop!');
        console.log(interaction.client.listeners('messageCreate'));
    },
};
