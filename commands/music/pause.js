const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useTimeline } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the current song'),
	async execute(interaction) {
		await interaction.deferReply();
		const timeline = useTimeline(interaction.guildId);

		// Check if song is currently playing
		if (!timeline?.track) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No song currently playing')
				.setDescription("Bot isn't playing anysong")
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		// if song is resumed/playing
		if (timeline.paused) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Error')
				.setDescription('The track is already paused')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		timeline.pause();

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Paused')
			.setDescription('The track is already paused')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		return interaction.editReply({ embeds: [embed] });
	},
};
