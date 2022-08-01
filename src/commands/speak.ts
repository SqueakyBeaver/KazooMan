import {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import { SlashCommandBuilder } from '@discordjs/builders';
import say from 'say';
import { ChatInputCommandInteraction } from 'discord.js';
import { VoiceConnection } from '@discordjs/voice';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('Make the bot say something in the voice channel')
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName('words')
                .setDescription('The words to speak')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('speed')
                .setDescription('The speed of the words')
                .setRequired(false)
        ),
    async speak(interaction: ChatInputCommandInteraction) {
        await interaction.followUp(`Saying ${interaction.options.getString('words')}`);
        const connection: VoiceConnection | undefined = getVoiceConnection(String(interaction.guild?.id));
        try {
            if (connection?.state.status === VoiceConnectionStatus.Disconnected) {
                return interaction.followUp({ content: 'I am not connected to a voice channel', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.followUp('Unable to Speak');
        }
        say.export(String(interaction.options.getString('words')), 'Microsoft Dan Desktop',Number(interaction.options.getNumber('speed')), 'spoken.ogg', (err) => {
            if (err) {
                console.error(err);
            }

            console.log('boop');
            const resource = createAudioResource('spoken.ogg');
            const player = createAudioPlayer();
            player.play(resource);
            connection?.subscribe(player);
        });
    },
};