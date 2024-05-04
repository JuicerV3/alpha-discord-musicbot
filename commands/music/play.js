const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const {
	sourceFormatter,
	iconURLFormatter,
} = require('../../functions/formatter');

module.exports = {
	category: 'music',
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song')
		.addStringOption((option) =>
			option
				.setName('query')
				.setDescription('search term')
				.setRequired(true)
		),
	async execute(interaction) {
		await interaction.deferReply();
		const player = useMainPlayer();
		const channel = interaction.member.voice.channel;
		const query = interaction.options.getString('query');

		// Chack if user is in voice channel
		if (!channel) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('You are not in a voice channel');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		// Reject spotify podcast because discord-player cannot find result
		if (query.includes('open.spotify.com/episode')) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Spotify podcast not supported');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		const result = await player.search(query, {
			requestedBy: interaction.user,
		});

		// Return embed if search result not found
		if (!result.hasTracks()) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle(`No search results found for \`${query}\``)
				.setDescription(`No search results found for \`${query}\``);
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		try {
			const { track, searchResult } = await player.play(channel, result, {
				nodeOptions: {
					metadata: interaction,
					volume: 50,
					noEmitInsert: true,
					leaveOnStop: false,
					leaveOnEmpty: true,
					leaveOnEmptyCooldown: 6000000,
					leaveOnEnd: true,
					leaveOnEndCooldown: 6000000,
					pauseOnEmpty: true,
					preferBridgedMetadata: true,
					disableBiquad: true,
				},
				requestedBy: interaction.user,
				connectionOptions: {
					deaf: true,
				},
			});

			console.log(
				`\u001b[1;34m[Player]: Added ${
					track.title
				} - (${sourceFormatter(
					track.source
				)})\n   └─[Query]: ${query}\u001b[0m`
			);

			// Started playing embed
			const embed = new EmbedBuilder()
				.setColor(0x96ffff)
				.setAuthor({
					name: `${
						searchResult.hasPlaylist() ? 'Playlist' : 'Track'
					} queued`,
					iconURL: iconURLFormatter(
						track.source,
						interaction.user.avatarURL()
					),
				})
				.setTitle(track.title)
				.setURL(track.url)
				.setThumbnail(track.thumbnail)
				.setDescription(`${track.author}`)
				.setFields(
					{
						name: 'Track length',
						value: track.duration,
						inline: true,
					},
					{
						name: 'Source',
						value: sourceFormatter(track.source, track.views),
						inline: true,
					}
				)
				.setFooter({
					text: `Requested by ${interaction.user.username} • αlpha@_juicerv3`,
					iconURL: interaction.user.avatarURL(),
				});
			// if there is a queue Display song position
			if (track.queue) {
				let songPos = track.queue.node.getTrackPosition(track) + 1;
				if (songPos === 1) songPos = '1 • Next';
				embed.addFields({
					name: 'Position on queue',
					value: `${songPos}`,
					inline: true,
				});
			}
			// if query is playlist Display playlist name
			if (searchResult.playlist != undefined) {
				embed.addFields({
					name: 'Playlist',
					value: searchResult.playlist.title,
					inline: false,
				});
			}
			const nowplayingEmbed = await interaction.editReply({
				embeds: [embed],
			});
			setTimeout(() => nowplayingEmbed.delete(), 30000);
			return;
		} catch (e) {
			console.error(e);
			const embed = new EmbedBuilder()
				.setColor(0xf54242)
				.setTitle('Something went wrong')
				.setDescription(
					`Something went wrong while trying to play \`${query}\``
				);
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}
	},
};
