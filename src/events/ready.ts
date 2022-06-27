import { Client, Collection, Message } from 'discord.js';
import clc from 'cli-color';

import { sendDailyMessages } from '../daily';
import { database } from '../index';
import { GuildData } from '../db/database';

async function send_it(client: Client) {
    // Testing
    // const channel = client.channels.cache.get('637316663267819561');
    // "Production"
    console.log('I\'m in');

    const guilds: Array<GuildData> = 
        await database.filterGuildInfo({ daily_channel: {$regex: /^(?!\s*$).+/ } });

    for (const guild of guilds) {
        const channel: any = await client.channels.fetch(String(guild.daily));

        // Check to see if the last message was sent recently
        // Will use the database for this later most likely
        let exit = false;
        await channel?.messages.fetch()
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
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client: Client) {
        console.log(clc.blue(`Ready! Logged in as ${client.user?.tag}`));
        setInterval(send_it, 600000, client);
    },
};
