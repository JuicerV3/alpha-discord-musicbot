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
			function nFormatter(num, digits) {
				const lookup = [
					{ value: 1, symbol: '' },
					{ value: 1e3, symbol: 'K' },
					{ value: 1e6, symbol: 'M' },
					{ value: 1e9, symbol: 'G' },
					{ value: 1e12, symbol: 'T' },
					{ value: 1e15, symbol: 'P' },
					{ value: 1e18, symbol: 'E' },
				];
				const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
				const item = lookup.findLast((item) => num >= item.value);
				return item
					? (num / item.value)
							.toFixed(digits)
							.replace(regexp, '')
							.concat(item.symbol)
					: '0';
			}
			let trackSource =
				track.source.charAt(0).toUpperCase() + track.source.slice(1);
			if (track.source === 'youtube') {
				trackSource = `${
					track.source.charAt(0).toUpperCase() + track.source.slice(1)
				} • ${nFormatter(track.views, 1)} views`;
			}
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
				`\u001b[1;34m[Player]: Added ${track.title} - (${trackSource})\n   └─[Query]: ${query}\u001b[0m`
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
						value: `${trackSource}`,
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
			const msg = await interaction.editReply({ embeds: [embed] });
			setTimeout(() => msg.delete(), 30000); //timeout delete 30s
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
