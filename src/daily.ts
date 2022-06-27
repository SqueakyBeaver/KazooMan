import axios from 'axios';
import { HTMLElement, parse } from 'node-html-parser';
import { Client, MessageEmbed, TextChannel } from 'discord.js';

interface HolidayResult {
    link: string,
    name: string,
}

interface QuoteResult {
    quote: string,
    author: string,
}

export async function getDailyHolidays(day: number, month: number, year: number): Promise<HolidayResult[] | undefined> {
    try {
        const data = await axios.get(
            `https://www.checkiday.com/${month}/${day}/${year}/`
        );
        const root = parse(data.data);

        const results = root.querySelectorAll('#magicGrid .mdl-card__title-text > a');

        const holidays: HolidayResult[] = [];

        for (let i = 0; i < results.length; ++i) {
            holidays.push({
                link: String(results[i].getAttribute('href')),
                name: String(results[i].rawText),
            });
        }

        return holidays;
    } catch (error) {
        console.log(error);
    }
}

// Get the daily quote from en.wikiquote.org
export async function getDailyQuote(day: number, month: number, year: number): Promise<QuoteResult> {
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

    // I have a very specific reason for the -7, I swear
    const data = await axios.get(
        `https://en.wikiquote.org/wiki/Wikiquote:Quote_of_the_day/${months[month]}_${year - 7}`
    );
    const root: HTMLElement = parse(data.data);
    
    const quoteChunk: HTMLElement | null |undefined = root.querySelector(`dl > dt > a[title="${months[month]} ${day}"]`)
        ?.parentNode.parentNode.nextElementSibling.querySelector('table');
    
    const quoteText = quoteChunk?.rawText
        .trim().replace(/~ */g, '').split('\n');

    return {
        quote: String(quoteText?.[0]),
        author: String(quoteText?.[quoteText?.length - 1]),
    };
}

export async function sendDailyMessages(client: Client, channel: TextChannel) {
    const send_date = new Date(Date.now() + 3600000 * -5);

    try {
        const holidays: HolidayResult[] | undefined = await getDailyHolidays(
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
        holidays?.forEach((holiday: HolidayResult) => {
            holiday_str += `[${holiday.name}](<${holiday.link}>)\n`;
        });

        channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(
                        `Quote of the day for ${send_date.toDateString()}`
                    )
                    .setDescription(String(qotd.quote))
                    .setFooter({text: `By: ${qotd.author}`})
                    .setColor('RANDOM'),
                new MessageEmbed()
                    .setTitle(`Holidays for ${send_date.toDateString()}`)
                    .setDescription(holiday_str)
                    .setColor('RANDOM'),
            ]
        })
            .then((message) => {
                message.crosspost;
                message.startThread({ name: 'Daily Discussion' });
            })
            .catch(console.error);
    } catch (error) {
        console.error(error);
    }
}

