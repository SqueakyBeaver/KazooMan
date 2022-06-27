import { SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import { commandsList } from '../index.js';

// Put it all in a scope so that the functions don't name conflict
// Also so I can collapse it all :>

const viewBuilder = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setDescription('See the current server config');

const dailyBuilder = new SlashCommandSubcommandBuilder()
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

const reportBuilder = new SlashCommandSubcommandBuilder()
    .setName('reports')
    .setDescription('Where to send reports')

    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Where to send report messages'));

const disableBuilder = new SlashCommandSubcommandBuilder()
    .setName('disable')
    .setDescription('Disable a command')

    .addStringOption(option => {
        for (const key of commandsList.keys()) {
            console.log(key);
            if (key) option.addChoices({name: String(key), value: String(key)});
        }
        return option.setName('command').setDescription('Command to disable');
    });

export const data = new SlashCommandSubcommandGroupBuilder()
    .setName('config')
    .setDescription('Configuration options')
    .addSubcommand(viewBuilder)
    .addSubcommand(dailyBuilder)
    .addSubcommand(reportBuilder)
    .addSubcommand(disableBuilder);


export async function view(interaction: CommandInteraction) {
    await interaction.followUp('This is a message');
}

export async function daily(interaction: CommandInteraction) {

}

export async function report(interaction: CommandInteraction) {

}

export async function disable(interaction: CommandInteraction) {

}