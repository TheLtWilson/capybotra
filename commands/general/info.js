const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about the bot'),
    async execute(interaction) {
        await interaction.reply({
            content: 'Hello, I am a bot made by [wilson](https://ltwilson.tv)! meow :3',
            flags: MessageFlags.Ephemeral
        });
    }
};