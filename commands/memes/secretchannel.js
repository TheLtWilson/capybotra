const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, MessageFlags } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir);
}

// File to store channel mappings
const channelFile = path.join(dataDir, 'secret_channels.json');

// Load existing channel mappings
function loadChannelMappings() {
	if (fs.existsSync(channelFile)) {
		const data = fs.readFileSync(channelFile, 'utf8');
		return JSON.parse(data);
	}
	return {};
}

// Save channel mappings
function saveChannelMappings(mappings) {
	fs.writeFileSync(channelFile, JSON.stringify(mappings, null, 2));
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('secretchannel')
		.setDescription('Set the secret channel for meme submissions')
		.addChannelOption(option =>
			option
				.setName('channel')
				.setDescription('The channel to set as secret channel')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const guildId = interaction.guildId;

		try {
			// Load existing mappings
			const channelMappings = loadChannelMappings();

			// Update the mapping for this guild
			channelMappings[guildId] = channel.id;

			// Save the updated mappings
			saveChannelMappings(channelMappings);

			await interaction.reply({
				content: `Secret channel has been set to ${channel}!`,
				flags: MessageFlags.Ephemeral,
			});
		}
		catch (error) {
			console.error('Error setting secret channel:', error);
			await interaction.reply({
				content: 'There was an error setting the secret channel!',
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};