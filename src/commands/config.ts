import { SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import { commandsList, database } from '../index';
import { GuildData } from '../db/database';
// Put it all in a scope so that the functions don't name conflict
// Also so I can collapse it all :>

const viewBuilder = new SlashCommandSubcommandBuilder()
    .setName('view')
    .setDescription('See the current server config');

const dailyBuilder = new SlashCommandSubcommandBuilder()
    .setName('daily')
    .setDescription('Daily Message Options')

    .addBooleanOption((option) =>
        option
            .setName('enabled')
            .setDescription('Whether to send Daily messages')
            .setRequired(true))

    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Where to send the daily message'));

const reportBuilder = new SlashCommandSubcommandBuilder()
    .setName('reports')
    .setDescription('Report Config options')

    .addBooleanOption((option) =>
        option
            .setName('enabled')
            .setDescription('Whether to enable Reports')
            .setRequired(true))

    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Where to send report messages'));

const toggleBuilder = new SlashCommandSubcommandBuilder()
    .setName('toggle')
    .setDescription('Toggle a command')

    .addStringOption(option => {
        for (const key of commandsList.keys()) {
            if (key) {
                option.addChoices({name: String(key), value: String(key)});
            }
        }
        return option.setName('command').setDescription('Command to disable').setRequired(true);
    });

export const data = new SlashCommandSubcommandGroupBuilder()
    .setName('config')
    .setDescription('Configuration options')
    .addSubcommand(viewBuilder)
    .addSubcommand(dailyBuilder)
    .addSubcommand(reportBuilder)
    .addSubcommand(toggleBuilder);


export async function view(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return await interaction.followUp('This command is only available in servers!');
    
    const guildInfo: GuildData = await database.getGuildInfo(String(interaction.guildId));
    const infoString = 
        `**Daily channel:** ${guildInfo.daily? '<#'+guildInfo.daily + '>' : 'disabled'}\n` +
        `**Reports:** ${guildInfo.reports? 'sent to <#' + guildInfo.reports + '>': 'disabled'}\n` +
        `**Disabled commands:** ${guildInfo.disabled? guildInfo.disabled: 'none'}\n`;
    
    return await interaction.followUp({
        content: 'This server\'s configurations',
        embeds: [ new EmbedBuilder()
            .setTitle(`Config for ${interaction.guild?.name}`)
            .setFooter({text: 'Ur mom is sus'})
            .setDescription(infoString).toJSON()
        ]});
}

export async function daily(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return await interaction.followUp('This command is only available in servers!');
    
    if (!interaction.options.getBoolean('enabled')) {
        await database.writeConfig({
            id: interaction.guild?.id,
            daily: ''
        });
        return await interaction.followUp('Daily messages disabled');
    }

    await database.writeConfig({
        id: interaction.guild?.id,
        daily: String(interaction.options.getChannel('channel')?.id)
    });

    return await interaction.followUp(
        `Daily messages will be sent to ${interaction.options.getChannel('channel')}`);
        
}

export async function reports(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return await interaction.followUp('This command is only available in servers!');

    if (!interaction.options.getBoolean('enabled')) {
        await database.writeConfig({
            id: interaction.guild?.id,
            reports: ''
        });
        return await interaction.followUp('Reports disabled');
    }

    await database.writeConfig({
        id: interaction.guild?.id,
        reports: String(interaction.options.getChannel('channel')?.id)
    });

    return await interaction.followUp(
        `Report messages will be sent to ${interaction.options.getChannel('channel')}`);
}

export async function toggle(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return await interaction.followUp('This command is only available in servers!');
    
    return await interaction.followUp(
        'Please use Discord\'s builtin slash command permission system\n' +
        'https://support.discord.com/hc/en-us/articles/4644915651095-Command-Permissions');
}