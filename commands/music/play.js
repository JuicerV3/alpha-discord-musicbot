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
					'https://cdn.discordapp.com/attachments/985226448686174228/1231996659597312031/youtube-logo.png';
			} else {
				sourceIconURL = interaction.client.user.displayAvatarURL();
			}

			console.log(
				`\u001b[1;34m[Player]: Added ${track.title} - (${sourceName})\n   └─[Query]: ${query}\u001b[0m`
			);

			const embed = new EmbedBuilder()
				.setColor(0x96ffff)
				.setAuthor({
					name: `${
						searchResult.hasPlaylist() ? 'Playlist' : 'Track'
					} queued`,
					iconURL: sourceIconURL,
				})
				.setTitle(track.title)
				.setURL(track.url)
				.setThumbnail(track.thumbnail)
				.setDescription(`**${track.author}**`)
				.setFields(
					{
						name: 'Track length',
						value: track.duration,
						inline: true,
					},
					{
						name: 'Source',
						value: `${sourceName}`,
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
			if (track.source === 'youtube') {
				embed.addFields({
					name: 'Youtube Views',
					value: `${track.views
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
				});
			}
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
