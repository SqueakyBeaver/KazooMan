import { SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';

import { commands } from '../index';


const view = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setDescription('See the current server config');

const daily = new SlashCommandSubcommandBuilder()
    .setName('daily')
    .setDescription('Set the channel where daily messages are sent')

    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Where to send the daily message'))

    .addBooleanOption((option) =>
        option
            .setName('enabled')
            .setDescription('Whether to send Daily messages'));

const report = new SlashCommandSubcommandBuilder()
    .setName('reports')
    .setDescription('Where to send reports')

    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Where to send report messages'));

const disable = new SlashCommandSubcommandBuilder()
    .setName('disable')
    .setDescription('Disable a command')

    .addStringOption(option => {
        for (const key of commands.keys()) {
            console.log(key);
            if (key) option.addChoices({name: String(key), value: String(key)});
        }
        return option.setName('command').setDescription('Command to disable');
    });

module.exports = {
    data: new SlashCommandSubcommandGroupBuilder()
        .setName('config')
        .setDescription('Configuration options')
        .addSubcommand(view)
        .addSubcommand(daily)
        .addSubcommand(report)
        .addSubcommand(disable),
};