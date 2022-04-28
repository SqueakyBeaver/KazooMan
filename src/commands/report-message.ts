import { MessageEmbed } from 'discord.js';
import { bot } from '../index';

module.exports = {
    // As of writing, the built-in class does not let me set a type
    name: 'Report Message',
    type: 3, // MESSAGE === 3

    async execute(interaction: any) {
        const user = interaction.targetMessage.author;
        const message = interaction.targetMessage.cleanContent;
        const report_embed = new MessageEmbed()
            .setTitle('Message Report')
            .addField('Message', `${message}`)
            .addField(
                'Reported User',
                `${user.username}#${user.discriminator}`
            );

        let report_channel: any = interaction.channel;
        if ('767843340137529394' == interaction.guild?.id) {
            report_channel = await bot.channels.cache.get('968670619371716628');
        } else {
            report_channel = interaction.channel;
        }

        report_channel.send({ embeds: [report_embed] });
        const me = await bot.users.fetch('557273716782923820');
        me.send({
            embeds: [
                report_embed.addField(
                    'Sent By',
                    `${interaction.user.username}#${interaction.user.discriminator}`
                ),
            ],
        });

        interaction.reply({
            content: 'Your report has been sent to the moderators',
            ephemeral: true,
        });
    },
};
