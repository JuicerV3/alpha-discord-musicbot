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
				.setDescription('search query')
				.setRequired(true)
		),
	async execute(interaction) {
		const player = useMainPlayer();
		const channel = interaction.member.voice.channel;
		const query = interaction.options.getString('query');
		await interaction.deferReply();

		if (!channel) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Cannot join a voice channel')
				.setDescription('You are not in a voice channel.');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		// except for spotify podcast because discord-player throw error
		if (query.includes('open.spotify.com/episode')) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Cannot play Spotify podcast')
				.setDescription('Spotify podcast not supported.');
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}

		const result = await player.search(query, {
			requestedBy: interaction.user,
		});

		if (!result.hasTracks()) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No search results found.')
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
					leaveOnEmptyCooldown: 600000,
					leaveOnEnd: true,
					leaveOnEndCooldown: 600000,
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
			if (searchResult.playlist != undefined) {
				embed.addFields({
					name: 'Playlist',
					value: searchResult.playlist.title,
					inline: true,
				});
			}
			const nowplayingEmbed = await interaction.editReply({
				embeds: [embed],
			});
			setTimeout(() => nowplayingEmbed.delete(), 30000); //timeout delete 30s
			return;
		} catch (e) {
			console.error(e);

			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Something went wrong')
				.setDescription(
					`Something went wrong while trying to play \`${query}\``
				);
			const msg = await interaction.editReply({ embeds: [embed] });
			return setTimeout(() => msg.delete(), 10000);
		}
	},
};
