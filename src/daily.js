const axios = require('axios');
const { parse } = require('node-html-parser');
const { MessageEmbed } = require('discord.js');

async function getDailyHolidays(day, month, year) {
    try {
        const data = await axios.get(
            `https://www.checkiday.com/${month}/${day}/${year}/`
        );
        const root = parse(data.data);

        const results = root.querySelectorAll('#magicGrid .mdl-card__title-text > a');

        const holidays = [];

        for (let i = 0; i < results.length; ++i) {
            holidays.push({
                link: results[i].getAttribute('href'),
                name: results[i].rawText,
            });
        }

        return holidays;
    } catch (error) {
        console.log(error);
    }
}

async function sendDailyMessages(client, channel) {
    let send_date = new Date(Date.now() + 3600000 * -5);

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
        holidays.forEach((holiday) => {
            holiday_str += `[${holiday.name}](<${holiday.link}>)\n`;
        });

        channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(
                        `Quote of the day for ${send_date.toDateString()}`
                    )
                    .setDescription(qotd.quote)
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

    // I have a very specific reason for the -7, I swear
    const data = await axios.get(
        `https://en.wikiquote.org/wiki/Wikiquote:Quote_of_the_day/${months[month]}_${year - 7}`
    );
    const root = parse(data.data);
    
    const quoteChunk = root.querySelector(`dl > dt > a[title="${months[month]} ${day}"]`)
        .parentNode.parentNode.nextElementSibling.querySelector('table');
    
    const quoteText = quoteChunk.rawText
        .trim('\n').replace(/~ */g, '').split('\n');

    return {
        quote: quoteText[0],
        author: quoteText[quoteText.length - 1],
    };
}

module.exports = {
    sendDailyMessages,
    getDailyQuote,
    getDailyHolidays,
};
