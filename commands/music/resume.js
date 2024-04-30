const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useTimeline } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resume the player'),
	async execute(interaction) {
		await interaction.deferReply();
		const timeline = useTimeline(interaction.guildId);

		// Check if song is currently playing
		if (!timeline?.track) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		// if song is resumed/playing
		if (!timeline.paused) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('The track is already resumed')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		timeline.resume();

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Track Resumed')
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
