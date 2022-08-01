// TODO: INTEGRATE A SERVER-SPECIFIC DATABASE

import { SlashCommandBuilder } from '@discordjs/builders';
import clc from 'cli-color';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { bot, database } from '../index.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('report a message or user')
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName('desc')
                .setDescription('Describe the issue')
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user to report')
        ),
    async report(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user');
        const desc = interaction.options.getString('desc');
        const report_embed = new EmbedBuilder()
            .setTitle('Report')
            .addFields([{name: 'Description', value: `${desc}` },
                {name: 'Reported User', value: `${user?.username}#${user?.discriminator}`}]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let report_channel: any = interaction.channel;

        // Personal testing server
        if ('637316662801989658' == interaction.guild?.id) {
            report_channel = interaction.channel;
        } else {
            const channel_id = String((await database.getGuildInfo(String(interaction.guild?.id))).reports);
            report_channel = 
                await bot.channels.fetch(channel_id)
                    .then().catch(_ => console.error(clc.red('no channel')));
        }
        try {
            report_channel.send({ embeds: [report_embed] });
            const me = await bot.users.fetch('557273716782923820');
            me.send({ embeds: [report_embed.addFields([{name: 'Sent By',
                value: `${interaction.user.username}#${interaction.user.discriminator}`}])] });

            interaction.followUp({ content: 'Your report has been sent to the moderators', ephemeral: true });
        } catch {
            return await interaction.followUp({
                content: 'Reports are not set up in this server. Plrease contact the admins',
                ephemeral: true,
            });
        }
    },
};
