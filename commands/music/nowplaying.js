const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { usePlayer, useTimeline } = require('discord-player');
const { sourceFormatter } = require('../../functions/formatter');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('View the currently playing song'),
	async execute(interaction) {
		await interaction.deferReply();
		const player = usePlayer(interaction.guildId);
		const timeline = useTimeline(interaction.guildId);

		// check if player is playing
		if (!timeline?.track) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		const { track, timestamp } = timeline;

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Now playing')
			.setDescription(
				`**[${track.title}](${track.url})**\n${track.author}`
			)
			.setFields({
				name: 'Progress',
				value: `${player.createProgressBar()}\n${
					timestamp.progress
				}% • ${sourceFormatter(track.source, track.views)}`,
			})
			.setThumbnail(track.thumbnail)
			.setFooter({
				text: `Requested by ${track.requestedBy?.tag} • αlpha@_juicerv3`,
				iconURL: track.requestedBy?.displayAvatarURL(),
			})
			.setAuthor({
				name: interaction.client.user.username,
				iconURL: interaction.client.user.avatarURL(),
			})
			.setTimestamp();
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 30000);
	},
};
