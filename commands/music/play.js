const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

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
		if (!channel)
			return interaction.reply('You are not in a voice channel.');
		const query = interaction.options.getString('query');

		// check for spotify podcast because discord-player throw error
		if (query.includes('open.spotify.com/episode')) {
			return interaction.reply(
				'Spotify podcast not supported at the moment.'
			);
		}

		await interaction.deferReply();

		const result = await player.search(query, {
			requestedBy: interaction.user,
		});

		if (!result.hasTracks()) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No results found.')
				.setDescription(`No results found for \`${query}\``)
				.setAuthor(interaction.user);

			return interaction.editReply({ embeds: [embed] });
		}

		try {
			const { track, searchResult } = await player.play(channel, result, {
				nodeOptions: {
					metadata: interaction,
					volume: 100,
					noEmitInsert: true,
					leaveOnStop: false,
					leaveOnEmpty: true,
					leaveOnEmptyCooldown: 60000,
					leaveOnEnd: true,
					leaveOnEndCooldown: 60000,
					pauseOnEmpty: true,
					preferBridgedMetadata: true,
					disableBiquad: true,
				},
				requestedBy: interaction.user,
				connectionOptions: {
					deaf: true,
				},
			});

			const sourceName =
				track.source.charAt(0).toUpperCase() + track.source.slice(1);

			const embed = new EmbedBuilder()
				.setColor(0x96ffff)
				.setTitle(
					`${
						searchResult.hasPlaylist() ? 'Playlist' : 'Track'
					} queued!`
				)
				.setThumbnail(track.thumbnail)
				.setDescription(
					`[${track.title}](${track.url}) - ${sourceName}`
				)
				.setFields(
					searchResult.playlist
						? [
								{
									name: 'Playlist',
									value: searchResult.playlist.title,
								},
						  ]
						: []
				)
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.avatarURL(),
				});

			return interaction.editReply({ embeds: [embed] });
		} catch (e) {
			console.error(e);

			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Something went wrong.')
				.setDescription(
					`Something went wrong while playing \`${query}\``
				)
				.setAuthor(interaction.user);
			return interaction.editReply({ embeds: [embed] });
		}
	},
};
