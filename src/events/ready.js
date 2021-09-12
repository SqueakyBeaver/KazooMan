const { Client, MessageEmbed } = require('discord.js');
const { sendDailyMessages } = require('../daily.js');

async function send_it(client) {
    const channel = client.channels.cache.get('875120528409632818');
    let exit = false;
    await channel.messages
        .fetch()
        .then(function (messages) {
            sent_by_self = messages.filter(
                (m) => m.author.id === '638201264080945162'
            );
            exit =
                sent_by_self.first().createdAt.getDate() >=
                new Date(Date.now() + 3600000 * -5).getDate();
        })
        .catch(console.error);

    if (exit === true) {
        return; // Don't judge me
    }

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
