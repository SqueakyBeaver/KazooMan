/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: REWORK THIS
import { EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getDailyHolidays, getDailyQuote } from '../daily.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test_daily')
        .setDescription('Test Daily stuff'),
    async testDaily(interaction: any) {
        const send_date: any = new Date(Date.now() + 3600000 * -5);

        const holidays: any = await getDailyHolidays(
            send_date.getDate(),
            send_date.getMonth() + 1,
            send_date.getFullYear()
        );

        const qotd = await getDailyQuote(
            send_date.getDate(),
            send_date.getMonth(),
            send_date.getFullYear()
        );

        let holiday_str = '';
        holidays.forEach((holiday: any) => {
            holiday_str += `[${holiday.name}](<${holiday.link}>)\n`;
        });

        const holidayEmbed = new EmbedBuilder()
            .setTitle(`Holidays for ${send_date.toDateString()}`)
            .setDescription(holiday_str);

        const quoteEmbed = new EmbedBuilder()
            .setTitle(`Quote of the day for ${send_date.toDateString()}`)
            .setDescription(qotd.quote)
            .setFooter({text: `By: ${qotd.author}`});

        await interaction.followUp({ embeds: [holidayEmbed, quoteEmbed] });
    },
};
