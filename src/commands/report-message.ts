// TODO: INTEGRATE A SERVER-SPECIFIC DATABASE

import { ContextMenuCommandBuilder } from '@discordjs/builders';
import clc from 'cli-color';
import { ApplicationCommandType, EmbedBuilder, MessageContextMenuCommandInteraction } from 'discord.js';

import { bot, database } from '../index.js';

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Report Message')
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),

    async report(interaction: MessageContextMenuCommandInteraction) {
        const user = interaction.targetMessage.author;
        const message = interaction.targetMessage.content;
        const report_embed = new EmbedBuilder()
            .setTitle('Message Report')
            .addFields([{name: 'Message', value:`${message}`},
                {name: 'Reported User',
                    value: `${user.username}#${user.discriminator}`}]
            );
            
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
            me.send({ embeds: 
                [report_embed.addFields([{name: 'Sent By',
                    value: `${interaction.user.username}#${interaction.user.discriminator}`}])]
            });

            interaction.followUp({ content: 'Your report has been sent to the moderators', ephemeral: true });
        } catch {
            return await interaction.followUp({
                content: 'Reports are not set up in this server. Plrease contact the admins',
                ephemeral: true,
            });
        }
    }
};