import { SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';

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


export async function view(interaction: CommandInteraction) {
    if (!interaction.guild) return await interaction.followUp('This command is only available in servers!');
    
    const guildInfo: GuildData = await database.getGuildInfo(String(interaction.guildId));
    const infoString = 
        `**Daily channel:** ${guildInfo.daily? '<#'+guildInfo.daily + '>' : 'disabled'}\n` +
        `**Reports:** ${guildInfo.reports? 'sent to <#' + guildInfo.reports + '>': 'disabled'}\n` +
        `**Disabled commands:** ${guildInfo.disabled? guildInfo.disabled: 'none'}\n`;
    
    return await interaction.followUp({
        content: 'This server\'s configurations',
        embeds: [ new MessageEmbed()
            .setTitle(`Config for ${interaction.guild?.name}`)
            .setFooter({text: 'Ur mom is sus'})
            .setColor('RANDOM')
            .setDescription(infoString).toJSON()
        ]});
}

export async function daily(interaction: CommandInteraction) {
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

export async function reports(interaction: CommandInteraction) {
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

export async function toggle(interaction: CommandInteraction) {
    if (!interaction.guild) return await interaction.followUp('This command is only available in servers!');
    
    const disabled = (await database.getGuildInfo(String(interaction.guild?.id))).disabled;
    const foundIndex = Number(disabled?.findIndex(element => 
        element === String(interaction.options?.getString('command'))));
    if (foundIndex >= 0) {
        disabled?.splice(foundIndex, 1);

        interaction.followUp(`${String(interaction.options?.getString('command'))} enabled`);
    } else {
        disabled?.push(String(interaction.options?.getString('command')));

        await interaction.followUp(`${String(interaction.options?.getString('command'))} disabled`);
    }

    await database.writeConfig({
        id: interaction.guild?.id,
        disabled: disabled
    });
}