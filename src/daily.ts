import axios from 'axios';
import Cheerio from 'cheerio';
import { Client, Message, MessageEmbed, TextChannel } from 'discord.js';

async function getDailyHolidays(day: number, month: number, year: number) {
    try {
        const data = await axios.get(
            `https://www.checkiday.com/${month}/${day}/${year}/`
        );
        const $ = Cheerio.load(data.data);
        const results = $('#magicGrid .mdl-card__title-text > a');

        const holidays = [];
        for (let i = 0; i < results.length; ++i) {
            holidays.push({
                link: results[i].attribs.href,
                name: results[i].name,
            });
        }

        return holidays;
    } catch (error) {
        console.log(error);
    }
}

async function sendDailyMessages(client: Client, channel: TextChannel) {
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
            .then((message: Message) => {
                message.crosspost;
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
                    .setFooter(`By: ${qotd.author}`)
                    .setColor('RANDOM'),
            ],
        });
    } catch (error) {
        console.error(error);
    }
}

// Get the daily quote from en.wikiquote.org
async function getDailyQuote(day: number, month: number, year: number) {
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
    const $ = Cheerio.load(data.data);

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

export {
    sendDailyMessages,
    getDailyQuote,
    getDailyHolidays,
};
