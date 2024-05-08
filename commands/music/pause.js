const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useTimeline } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the player'),
	async execute(interaction) {
		await interaction.deferReply();
		const timeline = useTimeline(interaction.guildId);

		// Check if user is in the same voice channel
		if (
			interaction.guild.members.me.voice.channelId &&
			interaction.member.voice.channelId !==
				interaction.guild.members.me.voice.channelId
		) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('You are not in the same voice channel');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		// Check if player is playing
		if (!timeline?.track) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		// if song is resumed/playing
		if (timeline.paused) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('The track is already paused');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		timeline.pause();

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Track paused');
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 15000);
	},
};
