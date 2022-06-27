import { Client, Collection, Message } from 'discord.js';
import { sendDailyMessages } from '../daily.js';
import clc from 'cli-color';

async function send_it(client: Client) {
    // Testing
    // const channel = client.channels.cache.get('637316663267819561');
    // "Production"
    console.log('I\'m in');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel: any = client.channels.cache.get('875120528409632818');
    let exit = false;
    await channel?.messages
        .fetch()
        .then(function (messages: Collection<string, Message>) {
            const sent_by_self = messages.filter(
                (m: Message) => m.author.id === '638201264080945162'
            );
            exit =
                sent_by_self.first()?.createdAt.getDate() ===
                new Date(Date.now() + 3600000 * -5).getDate();
        })
        .catch(console.error);

    if (exit) {
        return; // Don't judge me
    }

    if (new Date(Date.now() + 3600000 * -5).getUTCHours() === 0) {
        console.log('ayyyyyyy');
        sendDailyMessages(client, channel);
    }
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        console.log(clc.blue(`Ready! Logged in as ${client.user?.tag}`));
        setInterval(send_it, 600000, client);
    },
};
