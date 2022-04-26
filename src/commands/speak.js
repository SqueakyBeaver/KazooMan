const {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    VoiceConnectionStatus,
    StreamType,
} = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const say = require('say');
const { createReadStream } = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('Make the bot say something in the voice channel')
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
    async execute(interaction) {
        await interaction.reply(`Saying ${interaction.options.getString('words')}`);
        const connection = getVoiceConnection(interaction.guild.id);
        try {
            if (connection.status === VoiceConnectionStatus.Disconnected) {
                return interaction.reply({ content: 'I am not connected to a voice channel', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply('Unable to Speak');
        }
        say.export(interaction.options.getString('words'), 'Microsoft Dan Desktop', interaction.options.getNumber('speed'), 'spoken.ogg', (err) => {
            if (err) {
                console.error(err);
            }

            console.log('boop');
            const resource = createAudioResource('spoken.ogg');
            const player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);
        });
    },
};