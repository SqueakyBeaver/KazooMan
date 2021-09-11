const axios = require('axios');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');

async function getDailyHolidays(day, month, year) {
    try {
        const data = await axios.get(`https://www.checkiday.com/${month}/${day}/${year}/`);
        const $ = cheerio.load(data.data);
        const results = $('#magicGrid .mdl-card__title-text > a');

        const holidays = [];
        for (let i = 0; i < results.length; ++i) {
            holidays.push({
                link: results[i].attribs.href,
                name: results[i].children[0].data,
            });
        }

        return holidays;

    } catch (error) {
        console.log(error);
    }
}

async function sendDailyHolidays(client) {
    const channel = client.channels.cache.get('875120528409632818');

    const holidays = await getDailyHolidays(
        send_date.getDate(),
        send_date.getMonth() + 1,
        send_date.getFullYear())

    let send_str = '';
    holidays.forEach(holiday => {
        send_str += `[${holiday.name}](<${holiday.link}>)\n`;
    });
    channel.send({
        embeds: [
            new MessageEmbed()
                .setTitle(`Holidays for ${send_date.toDateString()}`)
                .setDescription(send_str)
        ]
    });
}

module.exports = {
    sendDailyHolidays,
};