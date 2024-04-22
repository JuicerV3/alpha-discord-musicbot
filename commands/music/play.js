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
		const query = interaction.options.getString('query');
		await interaction.deferReply();

		if (!channel) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Cannot join a voice channel')
				.setDescription('You are not in a voice channel.');
			return interaction.editReply({ embeds: [embed] });
		}

		// except for spotify podcast because discord-player throw error
		if (query.includes('open.spotify.com/episode')) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Cannot play Spotify podcast')
				.setDescription('Spotify podcast not supported.');
			return interaction.editReply({ embeds: [embed] });
		}

		const result = await player.search(query, {
			requestedBy: interaction.user,
		});

		if (!result.hasTracks()) {
			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('No search results found.')
				.setDescription(`No search results found for \`${query}\``);
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

			const sourceName =
				track.source.charAt(0).toUpperCase() + track.source.slice(1);
			let sourceIconURL;

			if (track.source === 'spotify') {
				sourceIconURL =
					'https://cdn.discordapp.com/attachments/985226448686174228/1231982720494735411/Spotify_logo.png';
			} else if (track.source === 'youtube') {
				sourceIconURL =
					'https://cdn.discordapp.com/attachments/985226448686174228/1231977563233189921/youtube-logo.png';
			} else {
				sourceIconURL = interaction.client.user.displayAvatarURL();
			}

			const embed = new EmbedBuilder()
				.setColor(0x96ffff)
				.setTitle(
					`${
						searchResult.hasPlaylist() ? 'Playlist' : 'Track'
					} queued`
				)
				.setThumbnail(track.thumbnail)
				.setDescription(
					`${track.author} - [${track.title}](${track.url})`
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
					name: `Requested by ${interaction.user.username}`,
					iconURL: interaction.user.avatarURL(),
				})
				.setFooter({
					text: `Powered by ${sourceName}`,
					iconURL: sourceIconURL,
				});
			return interaction.editReply({ embeds: [embed] });
		} catch (e) {
			console.error(e);

			const embed = new EmbedBuilder()
				.setColor(0xfffa6b)
				.setTitle('Something went wrong')
				.setDescription(
					`Something went wrong while trying to play \`${query}\``
				);
			return interaction.editReply({ embeds: [embed] });
		}
	},
};
