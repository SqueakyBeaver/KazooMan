import axios from 'axios';
import * as cheerio from 'cheerio';
import { MessageEmbed } from 'discord.js';

async function getDailyHolidays(day, month, year) {
    try {
        const data = await axios.get(
            `https://www.checkiday.com/${month}/${day}/${year}/`
        );
        const $ = cheerio.load(data.data);
        const results = $('#magicGrid .mdl-card__title-text > a');

        const holidays = [];
        for (let i = 0; i < results.length; ++i) {
            holidays.push({
                link: results[i].attribs.href,
                name: cheerio.text(results[i].children[0]),
            });
        }

        return holidays;
    } catch (error) {
        console.log(error);
    }
}

// Get the daily quote from en.wikiquote.org
async function getDailyQuote(day, month, year) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const data = await axios.get(
        `https://en.wikiquote.org/wiki/Wikiquote:Quote_of_the_day/${months[month]}_${year}`
    );
    const $ = cheerio.load(data.data);

    const content = $(`dl > dt > a[title="${months[month]} ${day}"]`)
        .parents('dl')
        .next(); // heh

    const quote = content.find('table').text().trim().split('\n');

    // So replace does not replace all occurence of the thing
    return {
        quote: quote[0],
        author: quote[quote.length - 1]
            .replace('~', '')
            .replace('~', '')
            .trim(),
    };
}

async function sendDailyMessages(client, channel) {
    const send_date = new Date(Date.now() + 3600000 * -5);

    try {
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
        holidays?.forEach((holiday) => {
            holiday_str += `[${holiday.name}](<${holiday.link}>)\n`;
        });
        console.log(qotd);

        channel
            .send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Holidays for ${send_date.toDateString()}`)
                        .setDescription(holiday_str)
                        .setColor('RANDOM'),
                ],
            })
            .then((message) => {
                message.crospost();
                message.startThread({ name: 'Holiday Discussion' });
            })
            .catch(console.error);

        channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(
                        `Quote of the day for ${send_date.toDateString()}`
                    )
                    .setDescription(qotd.quote)
                    .setFooter({text: `By: ${qotd.author}`})
                    .setColor('RANDOM'),
            ],
        });
    } catch (error) {
        console.error(error);
    }
}

export default {
    sendDailyMessages,
    getDailyQuote,
    getDailyHolidays,
};
