const { SlashCommandBuilder, EmbedBuilder, Options } = require('discord.js');
const { useQueue } = require('discord-player');
const {
	sourceFormatter,
	loopStatusFormatter,
} = require('../../functions/formatter');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('list queue')
		.addSubcommand((subcommand) =>
			subcommand.setName('list').setDescription('list current queue')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('clear').setDescription('Clear queue')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove song from queue')
				.addStringOption((option) =>
					option
						.setName('index')
						.setDescription('Song index number')
						.setRequired(true)
				)
		),
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

		if (interaction.options.getSubcommand() === 'list') {
			const tracks = queue.tracks.map(
				(track, index) =>
					`${++index}. [${track.title}](${track.url})\n └─ @${
						track.requestedBy.username
					} • ${sourceFormatter(queue.currentTrack.source)} • ${
						track.duration
					}`
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
					})**\nRequested by @${
						queue.currentTrack.requestedBy.username
					} • ${sourceFormatter(
						queue.currentTrack.source,
						queue.currentTrack.views
					)} • ${queue.currentTrack.duration}
				`
				)
				.setFields({ name: 'Tracklist', value: trackQueue })
				.setFooter({
					text: `${
						queue.durationFormatted
					} • Loop status: ${loopStatusFormatter(queue.repeatMode)}`,
				});
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 30000);
		} else if (interaction.options.getSubcommand() === 'clear') {
			const tracks = queue.tracks.map(
				(track, index) => `${++index}. ${track.title}`
			);

			if (tracks.length < 1) {
				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('Cannot remove song')
					.setDescription('There is no song in the current queue');
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}

			try {
				queue.clear();

				const embed = new EmbedBuilder()
					.setColor(0x3ec489)
					.setAuthor({
						name: interaction.user.username,
						iconURL: interaction.user.avatarURL(),
					})
					.setTitle('Queue cleared');
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 15000);
			} catch (e) {
				console.error(e);

				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('Something went wrong')
					.setDescription(
						`Something went wrong while trying to clear the queue \`${query}\``
					);
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}
		} else if (interaction.options.getSubcommand() === 'remove') {
			const songIndex = interaction.options.getString('index');
			const tracks = queue.tracks.map(
				(track, index) => `${++index}. ${track.title}`
			);

			if (tracks.length < 1) {
				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('Cannot remove song')
					.setDescription('There is no song in the current queue');
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}

			if (tracks[songIndex - 1] === undefined) {
				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('Cannot remove song')
					.setDescription(
						`Song number **${songIndex}** does not exist.\nMake sure to choose correct song index`
					)
					.setFields({
						name: 'Tracklist',
						value: `${tracks.join('\n')}`,
					});
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 20000);
			}

			try {
				queue.node.remove(songIndex - 1);

				const embed = new EmbedBuilder()
					.setColor(0x96ffff)
					.setAuthor({
						name: interaction.user.username,
						iconURL: interaction.user.avatarURL(),
					})
					.setTitle('Song removed')
					.setDescription(
						`Removed ${tracks[songIndex - 1]} from the queue`
					);
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 15000);
			} catch (e) {
				console.error(e);

				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('Something went wrong')
					.setDescription(
						`Something went wrong while trying to remove the song \`${query}\``
					);
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}
		}
	},
};
