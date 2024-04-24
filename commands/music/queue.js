const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('list queue'),
	async execute(interaction) {
		await interaction.deferReply();
		const queue = useQueue(interaction.guildId);

		if (!queue || !queue.currentTrack) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Not playing')
				.setDescription('im not playing anything right now')
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});
			return interaction.editReply({ embeds: [embed] });
		}

		const tracks = queue.tracks.map(
			(track, index) => `${++index}. ${track.title} - ${track.duration}`
		);
		let trackQueue;

		if (tracks.length < 1) {
			trackQueue = 'There is no more track.';
		} else if (tracks.length > 9) {
			tracksQueue = tracks.slice(0, 20).join('\n');
			tracksQueue += `\nand ${tracks.length - 10} other songs`;
		} else {
			trackQueue = tracks.join('\n');
		}

		let loopStatus;
		switch (queue.repeatMode) {
			case 0:
				loopStatus = 'Repeat Off';
				break;
			case 1:
				loopStatus = 'Repeat Current Track';
				break;
			case 2:
				loopStatus = 'Repeat Queue';
				break;
			case 3:
				loopStatus = 'Autoplay Next Track';
				break;
			default:
				modeName = 'Repeat Off';
		}

		const embed = new EmbedBuilder()
			.setColor(0x96ffff)
			.setAuthor({
				name: queue.player.client.user.username,
				iconURL: queue.player.client.user.avatarURL(),
			})
			.setTitle(`Current Queue`)
			.setThumbnail(queue.currentTrack.thumbnail)
			.setDescription(
				`**Now playing: ${queue.currentTrack.title}**\nRequested by ${queue.currentTrack.requestedBy.username}`
			)
			.setFields({ name: 'Tracklist', value: trackQueue })
			.setFooter({
				text: `${queue.durationFormatted} • Loop status: ${loopStatus}`,
			});
		return interaction.editReply({ embeds: [embed] });
	},
};
