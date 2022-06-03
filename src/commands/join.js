import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
} from '@discordjs/voice';
import { SlashCommandBuilder } from '@discordjs/builders';
import say from 'say';

export default {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a voice channel for tts')
        .addChannelOption((option) =>
            option
                .setName('voice_channel')
                .setDescription('The voice channel to join')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.reply("All right!");

        const channel = interaction.options.getChannel('voice_channel');
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        say.export('Abrbrbrbrbrbrbbrbrbrbrbrbbr', 1.5, 'intro.wav', (err) => {
            if (err) {
                console.error(err);
            }
        });
        const resource = createAudioResource('intro.wav');
        player.play(resource);
        connection.subscribe(player);
        // fs.rm('intro.wav');
    },
};