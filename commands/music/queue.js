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
		.setDescription('queue option')
		.addSubcommand((subcommand) =>
			subcommand.setName('list').setDescription('list current queue')
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('clear').setDescription('Clear queue')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('jump')
				.setDescription('jump to specific track')
				.addStringOption((option) =>
					option
						.setName('index')
						.setDescription('Track index number')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove track from the queue')
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

		// Check if player is playing
		if (!queue || !queue.currentTrack) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No track is currently playing');
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
				trackQueue = 'Queue is empty';
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
					.setTitle('There is no song in the current queue');
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}

			try {
				queue.clear();

				const embed = new EmbedBuilder()
					.setColor(0x3ec489)
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
		} else if (interaction.options.getSubcommand() === 'jump') {
			const songIndex = interaction.options.getString('index');
			const tracks = queue.tracks.map(
				(track, index) => `${++index}. ${track.title}`
			);

			let trackQueue;
			if (tracks.length < 1) {
				trackQueue = 'Queue is empty';
			} else if (tracks.length > 9) {
				tracksQueue = tracks.slice(0, 10).join('\n');
				tracksQueue += `\nand ${tracks.length - 10} other songs`;
			} else {
				trackQueue = tracks.join('\n');
			}

			if (tracks.length < 1) {
				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('There is no track in the current queue');
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}

			if (tracks[songIndex - 1] === undefined) {
				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('Cannot jump the queue')
					.setDescription(
						`Track number **${songIndex}** does not exist.\nMake sure to choose correct song index`
					)
					.setFields({
						name: 'Tracklist',
						value: `${trackQueue}`,
					});
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 20000);
			}

			try {
				queue.node.jump(songIndex - 1);

				const embed = new EmbedBuilder()
					.setColor(0x96ffff)
					.setTitle(`Jumped to ${tracks[songIndex - 1]}`);
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 15000);
			} catch (e) {
				console.error(e);

				const embed = new EmbedBuilder()
					.setColor(0xf54242)
					.setTitle('Something went wrong')
					.setDescription(
						`Something went wrong while trying to jump to the song \`${query}\``
					);
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}
		} else if (interaction.options.getSubcommand() === 'remove') {
			const songIndex = interaction.options.getString('index');
			const tracks = queue.tracks.map(
				(track, index) => `${++index}. ${track.title}`
			);

			let trackQueue;
			if (tracks.length < 1) {
				trackQueue = 'Queue is empty';
			} else if (tracks.length > 9) {
				tracksQueue = tracks.slice(0, 10).join('\n');
				tracksQueue += `\nand ${tracks.length - 10} other songs`;
			} else {
				trackQueue = tracks.join('\n');
			}

			if (tracks.length < 1) {
				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('There is no track in the current queue');
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 10000);
			}

			if (tracks[songIndex - 1] === undefined) {
				const embed = new EmbedBuilder()
					.setColor(0xfffa6b)
					.setTitle('Cannot remove track')
					.setDescription(
						`Track number **${songIndex}** does not exist.\nMake sure to choose correct song index`
					)
					.setFields({
						name: 'Tracklist',
						value: `${trackQueue}`,
					});
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 20000);
			}

			try {
				queue.node.remove(songIndex - 1);

				const embed = new EmbedBuilder()
					.setColor(0x96ffff)
					.setTitle('Song removed')
					.setDescription(
						`Removed ${tracks[songIndex - 1]} from the queue`
					);
				const msg = await interaction.editReply({ embeds: [embed] });
				return setTimeout(() => msg.delete(), 15000);
			} catch (e) {
				console.error(e);

				const embed = new EmbedBuilder()
					.setColor(0xf54242)
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
