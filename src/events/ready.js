import { sendDailyMessages } from '../daily.js';

async function send_it(client) {
    // Testing
    // const channel = client.channels.cache.get('637316663267819561');
    // "Production"
    console.log("I'm in");
    const channel = client.channels.cache.get('875120528409632818');
    let exit = false;
    await channel.messages
        .fetch()
        .then(function (messages) {
            const sent_by_self = messages.filter(
                (m) => m.author.id === '638201264080945162'
            );
            exit =
                sent_by_self.first().createdAt.getDate() ===
                new Date(Date.now() + 3600000 * -5).getDate();
        })
        .catch(console.error);

    if (exit === true) {
        return; // Don't judge me
    }

    if (new Date(Date.now() + 3600000 * -5).getUTCHours() === 0) {
        console.log('ayyyyyyy');
        sendDailyMessages(client, channel);
    }
}

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        setInterval(send_it, 600000, client);
    },
};
