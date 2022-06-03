import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('See the ping of the bot.'),
    async execute(interaction) {
        await interaction.reply(
            `Pong! It took me ${Math.round(
                interaction.client.ws.ping
            )}ms to get that.`
        );
    },
};
