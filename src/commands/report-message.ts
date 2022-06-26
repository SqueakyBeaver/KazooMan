// TODO: INTEGRATE A SERVER-SPECIFIC DATABASE

import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { MessageContextMenuInteraction, MessageEmbed } from 'discord.js';

import { bot } from '../index';

exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Report Message')
        .setType(3)
        .setDMPermission(false),

    async report(interaction: MessageContextMenuInteraction) {
        const user = interaction.targetMessage.author;
        const message = interaction.targetMessage.content;
        const report_embed = new MessageEmbed()
            .setTitle('Message Report')
            .addField('Message', `${message}`)
            .addField(
                'Reported User',
                `${user.username}#${user.discriminator}`
            );
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let report_channel: any = interaction.channel;
        if ('767843340137529394' == interaction.guild?.id) {
            report_channel = await bot.channels.cache.get('968670619371716628');
        } else {
            report_channel = interaction.channel;
        }
            
        await report_channel.send({ embeds: [report_embed] });
        const me = await bot.users.fetch('557273716782923820');
        await me.send({
            embeds: [
                report_embed.addField(
                    'Sent By',
                    `${interaction.user.username}#${interaction.user.discriminator}`
                ),
            ],
        });
        await interaction.followUp({
            content: 'Your report has been sent to the moderators',
            ephemeral: true,
        });
    }
};