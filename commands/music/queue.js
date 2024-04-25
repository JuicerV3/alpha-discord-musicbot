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
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		const tracks = queue.tracks.map(
			(track, index) =>
				`${++index}. [${track.title}](${track.url})\n └─${
					track.requestedBy.username
				} • ${
					track.source.charAt(0).toUpperCase() + track.source.slice(1)
				} • ${track.duration}`
		);

		let trackQueue;
		if (tracks.length < 1) {
			trackQueue = 'There is no more track.';
		} else if (tracks.length > 9) {
			tracksQueue = tracks.slice(0, 10).join('\n');
			tracksQueue += `\nand ${tracks.length - 10} other songs`;
		} else {
			trackQueue = tracks.join('\n');
		}

		let loopStatus;
		switch (queue.repeatMode) {
			case 0:
				loopStatus = 'Off';
				break;
			case 1:
				loopStatus = 'Loop Current Track';
				break;
			case 2:
				loopStatus = 'Loop Queue';
				break;
			case 3:
				loopStatus = 'Autoplay Next Track';
				break;
			default:
				loopStatus = 'Off';
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
				`**Now playing: [${queue.currentTrack.title}](${
					queue.currentTrack.url
				})**\nRequested by ${
					queue.currentTrack.requestedBy.username
				} • ${
					queue.currentTrack.source.charAt(0).toUpperCase() +
					queue.currentTrack.source.slice(1)
				} • ${queue.currentTrack.duration}
				`
			)
			.setFields({ name: 'Tracklist', value: trackQueue })
			.setFooter({
				text: `${queue.durationFormatted} • Loop status: ${loopStatus}`,
			});
		const msg = await interaction.editReply({ embeds: [embed] });
		return setTimeout(() => msg.delete(), 30000);
	},
};
