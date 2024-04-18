const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useTimeline } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume the current song'),
	async execute(interaction) {
		await interaction.deferReply();
		const timeline = useTimeline(interaction.guildId);

		// Check if song is currently playing
		if (!timeline?.track) {
			const embed = new EmbedBuilder()
				.setTitle('No song currently playing.')
				.setDescription('No song is currently playing')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		// if song is resumed/playing
		if (!timeline.paused) {
			const embed = new EmbedBuilder()
				.setTitle('Error')
				.setDescription('The track is already resumed')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		timeline.resume();

		const embed = new EmbedBuilder()
			.setTitle('Resumed')
			.setDescription('The track is already Resumed')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		return interaction.editReply({ embeds: [embed] });
	},
};
