const { Client, MessageEmbed } = require('discord.js');
const { sendDailyMessages } = require('../daily.js');

async function send_it(client) {
    console.log('h');

    if (new Date(Date.now() + 3600000 * -5).getUTCHours() === 0) {
        sendDailyMessages(client);
    }
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);

        var nextDate = new Date();
        if (nextDate.getMinutes() === 0) {
            // You can check for seconds here too
            await send_it(client);
        } else {
            nextDate.setHours(nextDate.getHours());
            nextDate.setMinutes(0);
            nextDate.setSeconds(0); // I wouldn't do milliseconds too ;)

            var difference = nextDate - new Date();
            setTimeout(send_it, difference, client);
        }
        setInterval(send_it, 1800000, client);
    },
};
