import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
} from '@discordjs/voice';
import { SlashCommandBuilder } from '@discordjs/builders';
import say from 'say';
import { CommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a voice channel for tts')
        .setDMPermission(false)
        .addChannelOption((option) =>
            option
                .setName('voice_channel')
                .setDescription('The voice channel to join')
                .setRequired(true)
        ),
    async join(interaction: CommandInteraction) {
        await interaction.followUp('All right!');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const channel: any = interaction.options.getChannel('voice_channel');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        say.export('Abrbrbrbrbrbrbbrbrbrbrbrbbr', undefined, 1.5, 'intro.wav', (_err) => {
            if (_err) {
                console.error(_err);
            }
        });
        const resource = createAudioResource('intro.wav');
        player.play(resource);
        connection.subscribe(player);
        // fs.rm('intro.wav');
    },
};