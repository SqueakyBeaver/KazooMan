module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // If it's not a command, do nothing
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'There was an error trying to execute that command!',
                epehemeral: true,
            });
        }

        
    },
};
