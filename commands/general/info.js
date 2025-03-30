const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const pkgjson = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Provides information about the bot'),
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const version = pkgjson.version;
		const description = pkgjson.description;
		const author = pkgjson.author;

		const embed = new EmbedBuilder()
			.setColor(0xfc5db7)
			.setTitle('About Me')
			.setDescription(description);

		embed.addFields({ name: 'Current Version', value: version, inline: true });
		embed.addFields({ name: 'Created By', value: `[${author.name}](${author.url})`, inline: true });

		await interaction.editReply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral,
		});
	},
};