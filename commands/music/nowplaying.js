const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { usePlayer, useTimeline } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('View the currently playing song'),
	async execute(interaction) {
		await interaction.deferReply();
		const node = usePlayer(interaction.guildId);
		const timeline = useTimeline(interaction.guildId);

		if (!timeline?.track) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Not playing')
				.setDescription('im not playing anything right now')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		const { track, timestamp } = timeline;

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setTitle('Now playing')
			.setDescription(`[${track.title}](${track.url})`)
			.setFields({ name: 'Progress', value: node.createProgressBar() })
			.setThumbnail(track.thumbnail)
			.setFooter({
				text: `Requested by ${track.requestedBy?.tag} • ${timestamp.progress}%`,
				iconURL: track.requestedBy?.displayAvatarURL(),
			})
			.setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.avatarURL(),
			});
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 30000);
	},
};
