import { MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getDailyHolidays, getDailyQuote } from '../daily.js';

export default {
    data: new SlashCommandBuilder()
        .setName('test_daily')
        .setDescription('Test Daily stuff'),
    async execute(interaction) {
        let send_date = new Date(Date.now() + 3600000 * -5);

        const holidays = await getDailyHolidays(
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
        holidays.forEach((holiday) => {
            holiday_str += `[${holiday.name}](<${holiday.link}>)\n`;
        });

        const holidayEmbed = new MessageEmbed()
            .setTitle(`Holidays for ${send_date.toDateString()}`)
            .setDescription(holiday_str)
            .setColor('RANDOM');

        const quoteEmbed = new MessageEmbed()
            .setTitle(`Quote of the day for ${send_date.toDateString()}`)
            .setDescription(qotd.quote)
            .setFooter(`By: ${qotd.author}`)
            .setColor('RANDOM');

        await interaction.reply({ embeds: [holidayEmbed, quoteEmbed] });
    },
};
