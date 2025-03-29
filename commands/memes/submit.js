const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// File to store channel mappings
const channelFile = path.join(__dirname, '..', '..', 'data', 'secret_channels.json');

// Load existing channel mappings
function loadChannelMappings() {
    if (fs.existsSync(channelFile)) {
        const data = fs.readFileSync(channelFile, 'utf8');
        return JSON.parse(data);
    }
    return {};
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit a meme for fried knight')
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('The URL to submit')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('note')
                .setDescription('Add a note to your submission')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const url = interaction.options.getString('url');
        const note = interaction.options.getString('note');
        const guildId = interaction.guildId;

        // Validate URL
        try {
            new URL(url);
        } catch (error) {
            await interaction.editReply({
                content: 'Please provide a valid URL!',
                flags: [MessageFlags.Ephemeral, MessageFlags.Urgent]
            });
            return;
        }

        try {
            // Load channel mappings
            const channelMappings = loadChannelMappings();
            
            // Check if a secret channel has been set for this guild
            if (!channelMappings[guildId]) {
                await interaction.editReply({ 
                    content: 'No submission channel has been set for this server yet.',
                    flags: [MessageFlags.Ephemeral, MessageFlags.Urgent]
                });
                return;
            }

            // Get the secret channel
            const secretChannelId = channelMappings[guildId];
            const secretChannel = await interaction.guild.channels.fetch(secretChannelId);

            if (!secretChannel) {
                await interaction.editReply({ 
                    content: 'The configured submission channel no longer exists. Please ask an administrator to set a new one.',
                    flags: [MessageFlags.Ephemeral, MessageFlags.Urgent]
                });
                return;
            }

            // Create and send embed to the secret channel
            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('New submission!')
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp();

            embed.addFields({ name: 'User', value: `${interaction.user.tag} (${interaction.user.displayName})` });
            embed.addFields({ name: 'URL', value: url }); // Add the URL to the embed
            if (note) {
                embed.addFields({ name: 'Note', value: note });
            }

            await secretChannel.send({ embeds: [embed] });

            await interaction.editReply({ 
                content: 'Your meme has been submitted successfully!',
                flags: MessageFlags.Ephemeral
            });
        } catch (error) {
            console.error('Error submitting URL:', error);
            await interaction.editReply({ 
                content: 'Something went wrong when submitting your meme. WILSOOOON FIX IT',
                flags: [MessageFlags.Ephemeral, MessageFlags.Urgent],
            });
        }
    },
};