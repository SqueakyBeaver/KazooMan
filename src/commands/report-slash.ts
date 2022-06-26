// TODO: INTEGRATE A SERVER-SPECIFIC DATABASE

import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

import { bot } from '../index';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('report a message or user')
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
    async report(interaction: CommandInteraction) {
        const user = interaction.options.getUser('user');
        const desc = interaction.options.getString('desc');
        const report_embed = new MessageEmbed()
            .setTitle('Report')
            .addField('Description', `${desc}`)
            .addField('Reported User', `${user?.username}#${user?.discriminator}`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let report_channel: any = interaction.channel;
        if ('767843340137529394' == interaction.guild?.id) {
            report_channel = await bot.channels.cache.get('968670619371716628');
        } else {
            report_channel = interaction.channel;
        }

        report_channel.send({ embeds: [report_embed] });
        const me = await bot.users.fetch('557273716782923820');
        me.send({ embeds: [report_embed.addField('Sent By', `${interaction.user.username}#${interaction.user.discriminator}`)] });

        interaction.followUp({ content: 'Your report has been sent to the moderators', ephemeral: true });
    },
};
