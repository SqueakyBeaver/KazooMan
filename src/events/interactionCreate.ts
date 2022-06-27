import { CommandInteraction } from 'discord.js';
import { commandsList, database } from '../index.js';

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: CommandInteraction) {    // Slash Command Handling
        console.log('handling interactions');

        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: false }).catch(console.error);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cmdParts: string[] = String(commandsList.get(interaction.commandName)).split(' ');
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const cmdReq = require('../' + cmdParts[0]);
            let cmd = Function('cmdReq', 'interaction', `cmdReq.${cmdParts[1]}(interaction)`);
            if (!cmd)
                return interaction.followUp({ content: 'An error has occured ' });
            

            for (const option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND') {
                    
                    //     if (option.name) {
                    //         args.push(option.name);
                    //     }
                    cmd = Function('cmdReq', 'interaction',`cmdReq.${option.name}(interaction);`);
                //     option.options?.forEach((x) => {
                //         if (x.value) args.push(x.value);
                //     });
                // } else if (option.value) args.push(option.value);
                }
            }

            try {
                await cmd(cmdReq, interaction);
            } catch (error) {
                console.error(error);
                await interaction.followUp({
                    content: 'There was an error trying to execute that command!',
                    ephemeral: true,
                });
            }
        }
        // Context Menu Handling
        if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: true })
                .then(console.log)
                .catch(console.error);
            // I don't actually know what type this is
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cmd: any = commandsList.get(interaction.commandName);
            if (cmd) {
                await cmd(interaction);
            }
        }
    }
};