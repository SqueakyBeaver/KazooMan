import { commands } from '../index.js';
import { Interaction } from 'discord.js';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Interaction) {    // Slash Command Handling
        console.log('handling interactions');
        if (interaction.isCommand()) {
            // await interaction.deferReply({ ephemeral: false }).catch(() => { });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cmd: any = commands.get(interaction.commandName);
            if (!cmd)
                return interaction.followUp({ content: 'An error has occured ' });
            
            const args = [];

            for (const option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND') {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            }

            try {
                await cmd.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error trying to execute that command!',
                    ephemeral: true,
                });
            }
        }

        // Context Menu Handling
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: false });
            // I don't actually know what type this is
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cmd: any = commands.get(interaction.commandName);
            if (cmd) cmd.execute(interaction);
        }
    },
};